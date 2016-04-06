from jinja2 import BaseLoader, Template
from jinja2.exceptions import TemplateNotFound


class PageLoader(BaseLoader):
    def __init__(self, pages):
        """
        :param pages: src.MyFlatPages.MyFlatPages
        """
        self._pages = pages

    def get_source(self, environment, template):

        """

        :type environment:jinja2.Environment
        :type template: str
        """
        TEMPLATE_BASE = """
            {{% extends '{0}' %}}
            {{% block page_content %}}
                {1}
            {{% endblock %}}
        """
        page = self._pages.get(template)
        if 'layout' in page.meta:
            layout = page.meta['layout'] + '.html'
        else:
            layout = 'default.html'
        source = TEMPLATE_BASE.format(layout, page.html)
        if source is None:
            raise TemplateNotFound(template)
        return source, None, lambda: True
