import re
import subprocess
from os import path
from typing import Dict
from urllib.parse import urlparse

from bs4 import BeautifulSoup
from flask import render_template

from src.grammar import get_grammar
from src.pages import MyFlatPages

root_folder_path = path.dirname(path.dirname(__file__))
pdf_folder_path = path.join(root_folder_path, 'pdf')

PDF_CONFIG = {
    'encoding': 'UTF-8',
    'page-size': 'A4',
    'margin-top': '1in',
    'margin-right': '0.7in',
    'margin-bottom': '0.8in',
    'margin-left': '0.7in',
    'print-media-type': '',
    'footer-center': '[page]',
    'footer-font-size': '9',
    'footer-spacing': '7',
    'enable-smart-shrinking': '',
    'zoom': '0.9'
}

PDF_TOC_CONFIG = {
    'xsl-style-sheet': path.join(pdf_folder_path, "toc.xsl")
}


def generate_pdf(pages, toc):
    tmp_file_path = path.join(pdf_folder_path, "tmp.html")
    with open(tmp_file_path, 'w', encoding="UTF-8") as tmp_file:
        tmp_file.write(get_pdf_content(pages, toc))
        output_file_path = path.join(pdf_folder_path, 'kotlin-docs.pdf')
        arguments = ["wkhtmltopdf"]
        for name, value in PDF_CONFIG.items():
            arguments.append("--" + name)
            if value != '':
                arguments.append(value)
        arguments.append('cover')
        arguments.append(path.join(pdf_folder_path, 'book-cover.html'))
        arguments.append('toc')
        for name, value in PDF_TOC_CONFIG.items():
            arguments.append("--" + name)
            arguments.append(value)
        arguments.append(tmp_file_path)
        arguments.append(output_file_path)

        subprocess.check_call(" ".join(arguments), shell=True, cwd=pdf_folder_path)
        return output_file_path


def get_pdf_content(pages: MyFlatPages, toc: Dict) -> str:
    content = []
    for toc_section in toc['content']:
        section = {
            'id': toc_section['title'].replace(' ', '_'),
            'title': toc_section['title'],
            'content': []
        }
        for reference in toc_section['content']:
            url = reference['url']
            if url.startswith('/'):
                url = url[1:]
            if url.endswith('.html'):
                url = url[:-5]

            if url == "docs/reference/grammar":
                page_html = render_template('pages/grammar.html', kotlinGrammar=get_grammar()).replace("<br>", "<br/>")
                document = BeautifulSoup(page_html, 'html.parser')
                document = document.find("div", {"class": "grammar"})
                page_id = "grammar"
                title = "Grammar"
            else:
                page = pages.get(url)
                if page is None:
                    continue
                title = page.meta['title']
                document = BeautifulSoup(page.html, 'html.parser')
                page_id = page.path.split('/')[-1]

            for element in document.find_all():
                if 'id' in element.attrs:
                    element.attrs['id'] = page_id + '_' + element.attrs['id']
                if element.name == "a":
                    if 'href' not in element.attrs:
                        continue
                    href = element.attrs['href']
                    url = urlparse(href)
                    if url.scheme == "":
                        if href.startswith('#'):
                            new_href = page_id + '_' + href[1:]
                        else:
                            url_path = url.path.split("/")[-1]
                            url_path = url_path[:-5] if url_path.endswith(".html") else url_path
                            new_href = url_path + ('_' + url.fragment if url.fragment != "" else "")
                        element.attrs['href'] = "#" + new_href

                header_regex = re.compile('^h(\d)$')
                if header_regex.match(element.name):
                    level = int(header_regex.match(element.name).group(1)) + 1
                    element.name = 'h' + str(level)

            section['content'].append({
                'id': page_id,
                'title': title,
                'content': document.decode()
            })
        content.append(section)
    drive, root_folder_path_rest = path.splitdrive(root_folder_path)
    page_html = render_template('pdf.html', content=content, root_folder=(drive + root_folder_path_rest)
                                .replace('\\', '/'))
    return page_html
