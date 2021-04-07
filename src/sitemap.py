from _md5 import md5
from os import path

from jinja2 import Environment
from jinja2.loaders import FileSystemLoader


root_folder_path = path.dirname(path.dirname(__file__))


def generate_sitemap(pages, filename='sitemap.xml'):
    non_static_urls = []


    for url, type in pages:
        if type is None:
            continue

        is_page = type.startswith('Page')
        is_exclude = type == 'Page_NotFound'

        if is_page and not is_exclude:
            location = dict(url=url, priority=0.3, lastmod=None)

            if url == '/' or type:
                location['priority'] = 1
            if type == 'Page_Documentation':
                location['priority'] = 0.8

            non_static_urls.append(location)

    env = Environment(loader=FileSystemLoader(path.join(root_folder_path, 'templates')))
    template = env.get_template('sitemap.xml')
    sitemap_content = template.render(locations=non_static_urls)

    with open(path.join(root_folder_path, 'dist', filename), 'w') as sitemap_file:
        sitemap_file.write(sitemap_content)

temporary_list = [
    "/docs/",
    "/docs/basic-kotlin-native-app.html",
    "/docs/basics.html",
    "/docs/building-mpp-with-gradle.html",
    "/docs/calling-javascript-from-kotlin.html",
    "/docs/command-line-library-js.html",
    "/docs/create-library-js.html",
    "/docs/foundation-faq.html",
    "/docs/getting-started-with-intellij-idea.html",
    "/docs/getting-started-with-maven.html",
    "/docs/httpservlets.html",
    "/docs/intro-to-kotlin-mpp.html",
    "/docs/kotlin-foundation.html?utm_source=dlvr.it&amp;utm_medium=facebook",
    "/docs/kotlin-native-with-clion.html",
    "/docs/kotlin-to-javascript.html",
    "/docs/mobile/",
    "/docs/multi-declarations.html",
    "/docs/platform-specific-declarations.html",
    "/docs/quick-run.html",
    "/docs/reference/index.html",
    "/docs/reference/mpp-intro.html",
    "/docs/reference/multi-declarations.html",
    "/docs/reference/operator-overloading.html",
    "/docs/reference/properties.html",
    "/docs/reference/returns.html",
    "/docs/reference/using-gradle.html",
    "/docs/running-tests.html",
    "/docs/setting-up.html",
    "/docs/spring-boot-restful.html",
    "/docs/spring-boot-restful-db.html",
    "/docs/targeting-multiple-platforms.html",
    "/docs/tutorials/",
    "/docs/tutorials/getting-started.html",
    "/docs/tutorials/javascript/calling-javascript-from-kotlin/calling-javascript-from-kotlin.html",
    "/docs/tutorials/javascript/getting-started-command-line/command-line-library-js.html",
    "/docs/tutorials/javascript/getting-started-idea/getting-started-with-intellij-idea.html",
    "/docs/tutorials/javascript/getting-started-maven/getting-started-with-maven.html",
    "/docs/tutorials/quick-run.html",
    "/docs/tutorials/spring-boot-restful.html",
    "/docs/using-ant.html",
    "/docs/using-gradle.html",
    "/docs/using-maven.html",
    "/docs/working-with-javascript.html",
    "/docs/working-with-klib.html",
]

def generate_temporary_sitemap():
    digest = md5(''.join(temporary_list).encode('utf-8')).hexdigest()
    pages = map(lambda url: [url, 'Page_Documentation'], temporary_list)
    generate_sitemap(pages, "sitemap-%s.xml" % digest)
