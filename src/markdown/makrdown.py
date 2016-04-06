from markdown import markdown

from .my_codehilite import CodeHiliteExtension
from .my_fenced_code import FencedCodeExtension
from .my_headerid import HeaderIdExtension


def customized_markdown(text):
    return markdown(text, extensions=[FencedCodeExtension(),
                                      CodeHiliteExtension(css_class="code", guess_lang=False),
                                      HeaderIdExtension()])
