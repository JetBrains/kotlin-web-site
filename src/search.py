import os

from algoliasearch import algoliasearch
from algoliasearch.index import Index

from src.api import get_api_page

client = algoliasearch.Client(os.environ['SEARCH_USER'], os.environ['SEARCH_KEY'])


def get_index():
    return Index(client, "dev_KOTLINLANG")


def normalize_url(url):
    if url.endswith('.html'):
        return url[1:-5]
    else:
        return url[1:] + "index"


def build_search_indices(site_structure, pages):
    index_objects = []
    for url, endpoint in site_structure:
        if (not url.endswith('.html')) and (not url.endswith('/')):
            continue
        url = normalize_url(url)
        if endpoint == 'page':
            page = pages.get(url)
            page_info = {
                'objectID': url,
                'content': page.html
            }
            page_info.update(page.meta)
            page_info.pop('layout', None)
            index_objects.append(page_info)
        elif endpoint == "api_page":
            page_info = get_api_page(url[4:])
            for table in page_info['content']('table'):
                table.extract()
            for overload_group in page_info['content'].findAll("div", {"class": "overload-group"}):
                overload_group.extract()
            page_info['objectID'] = url
            index_objects.append(page_info)
    index = get_index()
    index.add_objects(index_objects)
