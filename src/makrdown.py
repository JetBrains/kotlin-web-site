from markdown import markdown

from src.my_codehilite import CodeHiliteExtension
from src.my_fenced_code import FencedCodeExtension


def customized_markdown(text):
    return markdown(text, extensions=[FencedCodeExtension(), CodeHiliteExtension(css_class="code", guess_lang=False)])
