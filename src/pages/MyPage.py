from bs4 import BeautifulSoup
from flask_flatpages import Page
from werkzeug.utils import cached_property

from src.processors.processors import process_markdown_html


class MyPage(Page):
    @cached_property
    def unprocessed_html(self):
        return self.html_renderer(self)

    @cached_property
    def parsed_html(self):
        return process_markdown_html(BeautifulSoup(self.unprocessed_html, 'html.parser'))

    @cached_property
    def html(self):
        """The content of the page, rendered as HTML by the configured
        renderer.
        """
        return str(self.parsed_html).replace("<br>", "<br/>")
