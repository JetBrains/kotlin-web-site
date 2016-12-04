
class Feature:
    def __init__(self, content, meta):
        self._meta = meta
        self.content = content
        if 'id' in meta:
            self.id = meta['id']
        else:
            self.id = meta['title'].lower()

    def __getitem__(self, item):
        return self._meta[item]
