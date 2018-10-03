from os import path

import yaml
from bs4 import BeautifulSoup

from src.processors.processors import process_code_blocks, process_header_ids

root_folder = path.dirname(path.dirname(__file__))

titles = {}


def process_titles(row_titles, title_prefix, path_folder, suffix):
    if path_folder == '.':
        url = title_prefix + "/" + row_titles["url"].replace("./", "") + suffix
    else:
        url = title_prefix + row_titles["url"].split(path_folder, 1)[1] + suffix
    titles[url] = row_titles["title"]
    if "content" not in row_titles:
        return
    for child_titles in row_titles["content"]:
        process_titles(child_titles, title_prefix, path_folder, suffix)


def load_api_titles():
    api_title_files_path = path.join(root_folder, 'api', 'latest', 'jvm', 'stdlib', 'index.yml')
    with open(api_title_files_path) as title_files:
        process_titles(yaml.load(title_files)[0], 'latest/jvm/stdlib', '.', '')

    test_title_files_path = path.join(root_folder, 'api', 'latest', 'kotlin.test', 'index.yml')
    with open(test_title_files_path) as title_files:
        process_titles(yaml.load(title_files)[0], 'latest/kotlin.test',  '.', '')


def get_api_page(build_mode: bool, page_path):
    if not page_path.endswith('.html'):
        page_path += '.html'
    if len(titles) == 0:
        try:
            load_api_titles()
        except FileNotFoundError as e:
            if build_mode:
                raise e
            else:
                print("API module is not included: ", e)

    file_path = path.join(root_folder, 'api', page_path)
    if not path.exists(file_path):
        return None
    with open(file_path) as html_file:
        html_content = BeautifulSoup(html_file.read(), 'html.parser')
        html_content = process_code_blocks(html_content)
        html_content = process_header_ids(html_content)
        return {
            "title": titles[page_path],
            "content": html_content
        }
