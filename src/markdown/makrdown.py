from markdown import markdown
from markdown.extensions.tables import TableExtension

from .my_codehilite import CodeHiliteExtension
from .my_fenced_code import FencedCodeExtension
from .my_headerid import HeaderIdExtension


def customized_markdown(text):
    return markdown(text, extensions=[FencedCodeExtension(),
                                      CodeHiliteExtension(css_class="code", guess_lang=False),
                                      HeaderIdExtension(),
                                      TableExtension()])


def jinja_aware_markdown(text, flatPages):
    app = flatPages.app
    template_context = {}
    app.update_template_context(template_context)

    env = app.jinja_env
    template = env.from_string(text)
    return customized_markdown(template.render(template_context))
