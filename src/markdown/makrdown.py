import subprocess

import re
from bs4 import BeautifulSoup

languageMimeTypeMap = {
    "kotlin": "text/x-kotlin",
    "java": "text/x-java",
    "groovy": "text/x-groovy",
    "xml": "application/xml",
    "bash": "text/x-sh",
    "html": "application/xml",
    "javascript": "text/javascript",
    "json": "application/json",
    "js": "text/javascript"
}


def find_closest_tag(element, tagname):
    current_element = element.parent
    while current_element is not None and current_element.name != tagname:
        current_element = current_element.parent
    return current_element


def customized_markdown(text):
    kramdown = subprocess.Popen(
        "kramdown --input GFM --no-hard-wrap --smart-quotes apos,apos,quot,quot --no-enable-coderay",
        shell=True,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE)
    stdout_data, stderr_data = kramdown.communicate(input=text.encode("utf8"))
    return stdout_data.decode("utf8", errors='ignore')


def highlight_code(text):
    tree = BeautifulSoup(text, 'html.parser')
    code_elements = tree.select('pre > code')
    for element in code_elements:
        class_names = element.get("class")
        lang = None
        if class_names is not None:
            for class_name in class_names:
                if class_name.startswith("language-"):
                    lang = class_name[len("language-"):]

        if lang is None:
            continue

        parent_div = find_closest_tag(element, 'div')
        # Skip executable samples
        if parent_div is not None and parent_div.has_attr('class') and "sample" in parent_div['class']:
            continue
        element['data-lang'] = languageMimeTypeMap[lang]
        element['class'] = "code _highlighted"
    header_elements = tree.select('h1,h2,h3')
    for header in header_elements:
        if header.get("id") is not None:
            continue
        generated_id = re.sub(r'[^a-zA-Z0-9 \\-]', '', header.text)
        generated_id = generated_id.replace(' ', '-')
        generated_id = generated_id.lower()
        generated_id = generated_id.strip()
        header['id'] = generated_id
    return unicode(str(tree), "utf8").replace("<br>", "<br/>")


def jinja_aware_markdown(text, flatPages):
    app = flatPages.app
    template_context = {}
    app.update_template_context(template_context)

    env = app.jinja_env
    template = env.from_string(text)
    page_html = customized_markdown(template.render(template_context))
    return highlight_code(page_html)
