import subprocess
from xml.etree import ElementTree

import pygments
from bs4 import BeautifulSoup
from pygments.formatters import get_formatter_by_name
from pygments.lexers import get_lexer_by_name

languageMimeTypeMap = {
  "kotlin": "text/x-kotlin",
  "java": "text/x-java",
  "groovy": "text/x-groovy",
  "xml": "application/xml",
  "bash": "text/x-sh",
  "html": "application/xml",
  "javascript": "text/javascript",
  "json": "application/json"
}

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

        if lang is not None:
            if lang == "kotlin-executable":
                element.parent['class'] = "js-executable-code"
            else:
                element['data-lang'] = languageMimeTypeMap[lang]
                element['class'] = "code _highlighted"
    return unicode(str(tree), "utf8").replace("<br>", "<br/>")


def jinja_aware_markdown(text, flatPages):
    app = flatPages.app
    template_context = {}
    app.update_template_context(template_context)

    env = app.jinja_env
    template = env.from_string(text)
    page_html = customized_markdown(template.render(template_context))
    return highlight_code(page_html)
