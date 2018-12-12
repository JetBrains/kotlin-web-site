from os import path

from jinja2 import Environment
from jinja2.loaders import FileSystemLoader

root_folder_path = path.dirname(path.dirname(__file__))


def generate_sitemap(urls):
    sitemap_content = _generate_sitemap_content(urls)
    with open(path.join(root_folder_path, 'build', 'sitemap.xml'), 'w') as sitemap_file:
        sitemap_file.write(sitemap_content)


def _generate_sitemap_content(urls):
    non_static_urls = [url for url in urls if not (url.startswith('/_assets') or url.startswith('/assets'))]
    env = Environment(loader=FileSystemLoader(path.join(root_folder_path, 'templates')))
    template = env.get_template('sitemap.xml')
    return template.render(locations=non_static_urls)
