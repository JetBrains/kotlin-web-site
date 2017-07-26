import os

from algoliasearch import algoliasearch
from algoliasearch.index import Index
from bs4 import BeautifulSoup, Tag

from src.api import get_api_page


def get_client():
    return algoliasearch.Client(os.environ['SEARCH_USER'], os.environ['SEARCH_KEY'])


def get_index():
    return Index(get_client(), "dev_KOTLINLANG")


def normalize_url(url):
    if url.endswith('.html'):
        return url[1:-5]
    else:
        return url[1:] + "index"


def get_valuabe_content(page_content):
    content = []
    if isinstance(page_content, basestring):
        page_content = BeautifulSoup(page_content, "html.parser")
    for child in page_content.children:
        if not isinstance(child, Tag):
            continue
        if child.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'li']:
            content.append(child.text)
        elif child.name in ['ul', 'ol', 'blockquote', 'div']:
            content += get_valuabe_content(child)
        elif child.name in ['pre', 'code', 'hr', 'table', 'script', 'link', 'a']:
            continue
        else:
            raise Exception('Unknown tag ' + child.name)
    return content


def build_search_indices(site_structure, pages):
    index_objects = []
    for url, endpoint in site_structure:
        if (not url.endswith('.html')) and (not url.endswith('/')):
            continue
        url = normalize_url(url)
        if endpoint == 'page':
            page = pages.get(url)
            for ind, page_part in enumerate(get_valuabe_content(page.parsed_html)):
                page_info = {
                    'url': '/' + url + '.html',
                    'objectID': url + '#' + str(ind),
                    'content': page_part
                }
                if 'description' in page.meta:
                    page_info['description'] = page.meta['description']
                page_info['title'] = page.meta['title']
                if url.startswith('community'):
                    page_info['type'] = 'Community'
                elif url.startswith('docs/reference'):
                    page_info['type'] = 'Reference'
                elif url.startswith('docs/tutorials'):
                    page_info['type'] = 'Tutorial'
                else:
                    page_info['type'] = 'Page'
                index_objects.append(page_info)
        elif endpoint == "api_page":
            page_info = get_api_page(url[4:])
            for table in page_info['content']('table'):
                table.extract()
            for overload_group in page_info['content'].findAll("div", {"class": "overload-group"}):
                overload_group.extract()
            breadcrumbs = page_info['content'].find("div", {"class": "api-page-panel"})
            if breadcrumbs is not None:
                breadcrumbs.extract()
            for ind, page_part in enumerate(get_valuabe_content(page_info['content'])):
                page_info['content'] = page_part
                page_info['objectID'] = url + "#" + str(ind)
                page_info['url'] = '/' + url + '.html'
                page_info['type'] = "Standard Library"
                index_objects.append(page_info)
    index = get_index()
    index.add_objects(index_objects)
