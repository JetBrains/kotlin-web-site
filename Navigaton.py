class NavItem:
    def __init__(self, config, page):
        if 'url' in config:
            self.url = config['url']
        else:
            self.url = None
        self.title = config['title']
        self.items = []
        if 'items' in config:
            self.items = [NavItem(item_config, page) for item_config in config['items']]
        self._config = config
        self._current_url = page.path

    def is_active(self):
        for item in self.items:
            if item.is_active():
                return True
        if self.url is not None:
            url = self.url
            if url.startswith("/"):
                url = url[1:]
            if url.endswith(".html"):
                url = url[:-5]
            return self._current_url.startswith(url)
        else:
            return False

    def is_external(self):
        if hasattr(self, 'url'):
            return self.url.startswith("http://") or self.url.startswith("https://")
        else:
            return False

    def __getitem__(self, item):
        return self._config[item]


class Nav:
    def __init__(self, config, page):
        self._nav = {}
        for nav_id in config:
            self._nav[nav_id] = [NavItem(nav_item_config, page) for nav_item_config in config[nav_id]]

    def __getitem__(self, item):
        return self._nav[item]
