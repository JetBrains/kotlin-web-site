from bs4 import BeautifulSoup
from os import path, walk


dist_path = path.join(path.dirname(__file__), "../", "dist")


def get_dist_page_content(url):
    path_file = dist_path + url

    if url.endswith('/'):
        path_file += 'index.html'

    if path.exists(path_file):
        with open(path_file, 'r', encoding="UTF-8") as file:
            return file.read()

    raise Exception('Bad response during indexing')


def get_dist_page_xml(url):
    html_content = get_dist_page_content(url)
    return BeautifulSoup(html_content, "html.parser")


def get_dist_page_type(url):
    page_type = None

    if url.endswith('/') or url.endswith('.html'):
        page_type = 'Page'

        if url.startswith('community'):
            page_type = 'Page_Community'
        if url.startswith('docs/reference'):
            page_type = 'Page_Reference'
        if url.startswith('docs/tutorials'):
            page_type = 'Page_Tutorial'
        if url.endswith('404.html'):
            page_type = 'Page_NotFound'

        parsed = get_dist_page_xml(url)

        if url.startswith("/api/latest/"):
            page_type = "Page_API_stdlib" if "jvm/stdlib" in url else "Page_API_test"

        if url.startswith("/spec/"):
            page_type = "Page_Spec"

        if parsed.select_one("body[data-article-props]"):
            page_type = 'Page_Documentation'

        if parsed.find("meta", {"http-equiv": "refresh"}):
            page_type = 'Redirect'

    if url.endswith('pdf'):
        page_type = 'File_Pdf'

    if url.endswith('package-list') or url.endswith('index.yml'):
        page_type = 'File_Text'

    return page_type


def get_dist_pages():
    paths = []

    if path.isdir(dist_path):
        for root, dirnames, filenames in walk(dist_path):
            for filename in filenames:
                prefix_path = root[len(dist_path):]
                if not prefix_path: prefix_path = "/"

                url = path.join(prefix_path, filename)

                if url.endswith('index.html'): url = url[:-10]
                paths.append((url, get_dist_page_type(url)))

    return paths
