import os

from algoliasearch import algoliasearch
from algoliasearch.index import Index
from bs4 import BeautifulSoup, Tag
from flask import current_app as app

from src.api import get_api_page


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
    for i in range(start_index, len(content_parts)):
        if len(content_parts[i]) < 40 and i < len(content_parts) - 1:
            content_parts[i] = content_parts[i].rstrip()
            if not len(content_parts[i]) == 0 and not content_parts[i].endswith("."):
                content_parts[i] = content_parts[i] + ". "
            content_parts[i] = content_parts[i] + content_parts[i + 1].lstrip()
            del content_parts[i+1]
            group_small_content_pats(content_parts, i)
            return


def get_valuable_content(page_content):
    content = []
    if isinstance(page_content, basestring):
        page_content = BeautifulSoup(page_content, "html.parser")
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


def get_page_index_objects(content, url, page_path, title, type, description=None):
    index_objects = []
    for ind, page_part in enumerate(get_valuable_content(content)):
        page_info = {
            'url': url,
            'objectID': page_path + '#' + str(ind),
            'content': page_part,
            'title': title,
            'type': type,
            'description': description
        }
        if description is not None:
            page_info['description'] = description
        page_info['title'] = title

        index_objects.append(page_info)
    return index_objects


def build_search_indices(site_structure, pages):
    index_objects = []
    for url, endpoint in site_structure:
        if (not url.endswith('.html')) and (not url.endswith('/')):
            continue
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
                description
            )
        elif endpoint == "api_page":
            page_info = get_api_page(page_path[4:])
            for table in page_info['content']('table'):
                table.extract()
            for overload_group in page_info['content'].findAll("div", {"class": "overload-group"}):
                overload_group.extract()
            breadcrumbs = page_info['content'].find("div", {"class": "api-page-panel"})
            if breadcrumbs is not None:
                breadcrumbs.extract()
            index_objects += get_page_index_objects(
                page_info['content'],
                url,
                page_path,
                page_info['title'],
                "Standard Library"
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
                    'content': ''
                })
            else:
                index_objects += get_page_index_objects(
                    content,
                    url,
                    page_path,
                    title,
                    "Page"
                )
    index = get_index()
    index.add_objects(index_objects)
