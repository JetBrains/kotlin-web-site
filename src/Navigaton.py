from flask import request


class NavItem:
    def __init__(self, config):
        if 'url' in config:
            url = config['url']
            if not url.startswith('/'):
                url = '/' + url
            self.urls = [url]
        elif 'urls' in config:
            self.urls = config['urls']
        else:
            self.urls = None

        self.title = config['title']
        self.items = []
        if 'items' in config:
            self.items = [NavItem(item_config) for item_config in config['items']]
        self._config = config

    def is_active(self):
        for item in self.items:
            if item.is_active():
                return True
        if self.urls is not None:
            for url in self.urls:
                if request.path.startswith(url):
                    return True
            else:
                return False
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
    def __init__(self, config):
        self._nav = {}
        for nav_id in config:
            self._nav[nav_id] = [NavItem(nav_item_config) for nav_item_config in config[nav_id]]

    def __getitem__(self, item):
        return self._nav[item]
