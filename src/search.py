import os
from os import path
from typing import Dict

from algoliasearch import algoliasearch
from algoliasearch.index import Index
from bs4 import BeautifulSoup, Tag
from flask import current_app as app
from googleapiclient.discovery import build, Resource
from oauth2client.service_account import ServiceAccountCredentials

from src.api import get_api_page

root_folder = path.dirname(path.dirname(__file__))


def initialize_analyticsreporting() -> Resource:
    credentials = ServiceAccountCredentials.from_json_keyfile_name(
        os.environ['KEY_FILE_LOCATION'], scopes='https://www.googleapis.com/auth/analytics.readonly')
    analytics = build('analyticsreporting', 'v4', credentials=credentials)
    return analytics


def get_report(analytics: Resource) -> Dict:
    return analytics.reports().batchGet(
        body={
            "reportRequests":
                [
                    {
                        "viewId": "85132606",
                        "samplingLevel": "LARGE",
                        "filtersExpression": "ga:hostname==kotlinlang.org;ga:pagepath!@?",
                        "pageSize": 10000,
                        "orderBys": [
                            {
                                "fieldName": "ga:uniquepageviews",
                                "sortOrder": "DESCENDING"
                            }
                        ],
                        "dateRanges":
                            [
                                {
                                    "startDate": "30daysAgo",
                                    "endDate": "yesterday"
                                }
                            ],
                        "metrics":
                            [
                                {
                                    "expression": "ga:uniquepageviews",
                                    "alias": ""
                                }
                            ],
                        "dimensions":
                            [
                                {
                                    "name": "ga:pagePath"
                                }
                            ]
                    }
                ]
        }).execute()


def get_page_views_statistic() -> Dict[str, int]:
    page_views = {}
    analytics = initialize_analyticsreporting()
    report = get_report(analytics)
    for row in report["reports"][0]["data"]["rows"]:
        page_views[row["dimensions"][0]] = int(row['metrics'][0]["values"][0])
    return page_views


def get_client():
    return algoliasearch.Client(os.environ['SEARCH_USER'], os.environ['SEARCH_KEY'])


def get_index():
    return Index(get_client(), "dev_KOTLINLANG")


def get_page_path_from_url(url):
    if url.endswith('.html'):
        return url[1:-5]
    else:
        return url[1:] + "index"


def group_small_content_pats(content_parts, start_index=0):
    size = len(content_parts)
    for i in range(start_index, size):
        if len(content_parts[i]) < 40 and i < size - 1:
            content_parts[i] = content_parts[i].rstrip()
            if not len(content_parts[i]) == 0 and not content_parts[i].endswith("."):
                content_parts[i] = content_parts[i] + ". "
            content_parts[i] = content_parts[i] + content_parts[i + 1].lstrip()
            del content_parts[i + 1]
            group_small_content_pats(content_parts, i)
            return
    if size > 1 and len(content_parts[size - 1]) < 40:
        content_parts[size - 2] = content_parts[size - 2].rstrip()
        if not len(content_parts[size - 2]) == 0 and not content_parts[size - 2].endswith("."):
            content_parts[size - 2] = content_parts[size - 2] + ". "
        content_parts[size - 2] = content_parts[size - 2] + content_parts[size - 1].lstrip()
        del content_parts[size - 1]


def get_valuable_content(page_content):
    content = []
    for child in page_content.children:
        if not isinstance(child, Tag):
            continue
        if child.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'li', 'span']:
            content.append(child.text)
        elif child.name in ['ul', 'ol', 'blockquote', 'div']:
            content += get_valuable_content(child)
        elif child.name in ['pre', 'code', 'hr', 'table', 'script', 'link', 'a', 'br']:
            continue
        else:
            raise Exception('Unknown tag ' + child.name)
    group_small_content_pats(content)
    return content


def get_page_index_objects(content, url, page_path, title, type, page_views: int, description=None):
    index_objects = []
    for ind, page_part in enumerate(get_valuable_content(content)):
        page_info = {
            'url': url,
            'objectID': page_path + '#' + str(ind),
            'content': page_part,
            'title': title,
            'type': type,
            'description': description,
            'pageViews': page_views
        }
        if description is not None:
            page_info['description'] = description
        page_info['title'] = title

        index_objects.append(page_info)
    return index_objects


def build_search_indices(site_structure, pages):
    page_views_statistic = get_page_views_statistic()
    index_objects = []
    for url, endpoint in site_structure:
        if (not url.endswith('.html')) and (not url.endswith('/')):
            continue
        if url in page_views_statistic:
            page_views = page_views_statistic[url]
        else:
            page_views = 0
        page_path = get_page_path_from_url(url)
        if endpoint == 'page':
            page = pages.get(page_path)
            type = "Page"
            if page_path.startswith('community'):
                type = 'Community'
            elif page_path.startswith('docs/reference'):
                type = 'Reference'
            elif page_path.startswith('docs/tutorials'):
                type = 'Tutorial'
            description = None
            if 'description' in page.meta:
                description = page.meta['description']
            index_objects += get_page_index_objects(
                page.parsed_html,
                url,
                page_path,
                page.meta['title'],
                type,
                page_views,
                description
            )
        elif endpoint == "api_page":
            page_info = get_api_page(page_path[4:])
            for table in page_info['content']('table'):
                table.extract()
            for overload_group in page_info['content'].findAll("div", {"class": "signature"}):
                overload_group.extract()
            breadcrumbs = page_info['content'].find("div", {"class": "api-page-panel"})
            if breadcrumbs is not None:
                breadcrumbs.extract()
            index_objects += get_page_index_objects(
                page_info['content'],
                url,
                page_path,
                page_info['title'],
                "Standard Library",
                page_views
            )
        elif endpoint in ["coroutines_alias", "events_redirect", "community_redirect"]:
            continue
        else:
            client = app.test_client()
            content = client.get(url, follow_redirects=True)
            if content.status_code != 200:
                raise Exception('Bad response during indexing')
            parsed = BeautifulSoup(content.data, "html.parser")
            title = parsed.find("title").text

            content = parsed.find("div", {"class": "page-content"})
            if content is None:
                content = parsed.find("article", {"class": "page-content"})

            if content is None:
                index_objects.append({
                    'objectID': page_path,
                    'type': 'Page',
                    'title': title,
                    'url': url,
                    'content': '',
                    'pageViews': page_views
                })
            else:
                index_objects += get_page_index_objects(
                    content,
                    url,
                    page_path,
                    title,
                    "Page",
                    page_views
                )
    index = get_index()
    index.add_objects(index_objects)
