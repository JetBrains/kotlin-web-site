from os import path

from jinja2 import Environment
from jinja2.loaders import FileSystemLoader

root_folder_path = path.dirname(path.dirname(__file__))


def generate_sitemap(pages):
    non_static_urls = []

    for url, endpoint in pages:
        is_page = url.endswith('/') or url.endswith('.html') or url.endswith('pdf') or url.endswith('package-list') or url.endswith('index.yml')
        is_exclude = url.endswith('404.html')

        if  is_page and not is_exclude:
            non_static_urls.append(url)

    env = Environment(loader=FileSystemLoader(path.join(root_folder_path, 'templates')))
    template = env.get_template('sitemap.xml')
    sitemap_content = template.render(locations=non_static_urls)

    with open(path.join(root_folder_path, 'dist', 'sitemap.xml'), 'w') as sitemap_file:
        sitemap_file.write(sitemap_content)
