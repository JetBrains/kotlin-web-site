import re

from flask_flatpages.flatpages import FlatPages
from werkzeug.utils import import_string
from src.pages.MyPage import MyPage


class MyFlatPages(FlatPages):
    def _parse(self, content, path):
        """Parse a flatpage file, i.e. read and parse its meta data and body.

        :return: initialized :class:`Page` instance.
        """
        content = content.replace("\r\n", "\n")
        try:
            _, meta, content = re.compile(r'^-{3,}$', re.MULTILINE).split(content, 2)
        except:
            raise Exception("Can't find two --- markers in " + path)

        # Now we ready to get HTML renderer function
        html_renderer = self.config('html_renderer')

        # If function is not callable yet, import it
        if not callable(html_renderer):
            html_renderer = import_string(html_renderer)

        # Make able to pass custom arguments to renderer function
        html_renderer = self._smart_html_renderer(html_renderer)

        # Initialize and return Page instance
        return MyPage(path, meta, content, html_renderer)