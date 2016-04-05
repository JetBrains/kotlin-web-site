import markdown.extensions.fenced_code
import markdown.extensions.codehilite
import markdown.extensions.attr_list

DEBUG = True
FLATPAGES_EXTENSION = '.md'
FLATPAGES_MARKDOWN_EXTENSIONS = [
    markdown.extensions.attr_list.AttrListExtension(),
    markdown.extensions.codehilite.CodeHiliteExtension(guess_lang=False, css_class="code"),
    markdown.extensions.fenced_code.FencedCodeExtension()
]
