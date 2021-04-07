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
    "https://kotlinlang.org/docs/",
    "https://kotlinlang.org/docs/basic-kotlin-native-app.html",
    "https://kotlinlang.org/docs/basics.html",
    "https://kotlinlang.org/docs/building-mpp-with-gradle.html",
    "https://kotlinlang.org/docs/calling-javascript-from-kotlin.html",
    "https://kotlinlang.org/docs/command-line-library-js.html",
    "https://kotlinlang.org/docs/create-library-js.html",
    "https://kotlinlang.org/docs/foundation-faq.html",
    "https://kotlinlang.org/docs/getting-started-with-intellij-idea.html",
    "https://kotlinlang.org/docs/getting-started-with-maven.html",
    "https://kotlinlang.org/docs/httpservlets.html",
    "https://kotlinlang.org/docs/intro-to-kotlin-mpp.html",
    "https://kotlinlang.org/docs/kotlin-foundation.html?utm_source=dlvr.it&utm_medium=facebook",
    "https://kotlinlang.org/docs/kotlin-native-with-clion.html",
    "https://kotlinlang.org/docs/kotlin-to-javascript.html",
    "https://kotlinlang.org/docs/mobile/",
    "https://kotlinlang.org/docs/multi-declarations.html",
    "https://kotlinlang.org/docs/platform-specific-declarations.html",
    "https://kotlinlang.org/docs/quick-run.html",
    "https://kotlinlang.org/docs/reference/index.html",
    "https://kotlinlang.org/docs/reference/mpp-intro.html",
    "https://kotlinlang.org/docs/reference/multi-declarations.html",
    "https://kotlinlang.org/docs/reference/operator-overloading.html",
    "https://kotlinlang.org/docs/reference/properties.html",
    "https://kotlinlang.org/docs/reference/returns.html",
    "https://kotlinlang.org/docs/reference/using-gradle.html",
    "https://kotlinlang.org/docs/running-tests.html",
    "https://kotlinlang.org/docs/setting-up.html",
    "https://kotlinlang.org/docs/spring-boot-restful.html",
    "https://kotlinlang.org/docs/spring-boot-restful-db.html",
    "https://kotlinlang.org/docs/targeting-multiple-platforms.html",
    "https://kotlinlang.org/docs/tutorials/",
    "https://kotlinlang.org/docs/tutorials/getting-started.html",
    "https://kotlinlang.org/docs/tutorials/javascript/calling-javascript-from-kotlin/calling-javascript-from-kotlin.html",
    "https://kotlinlang.org/docs/tutorials/javascript/getting-started-command-line/command-line-library-js.html",
    "https://kotlinlang.org/docs/tutorials/javascript/getting-started-idea/getting-started-with-intellij-idea.html",
    "https://kotlinlang.org/docs/tutorials/javascript/getting-started-maven/getting-started-with-maven.html",
    "https://kotlinlang.org/docs/tutorials/quick-run.html",
    "https://kotlinlang.org/docs/tutorials/spring-boot-restful.html",
    "https://kotlinlang.org/docs/using-ant.html",
    "https://kotlinlang.org/docs/using-gradle.html",
    "https://kotlinlang.org/docs/using-maven.html",
    "https://kotlinlang.org/docs/working-with-javascript.html",
    "https://kotlinlang.org/docs/working-with-klib.html",
]

def generate_temporary_sitemap():
    digest = md5(''.join(temporary_list).encode('utf-8')).hexdigest()
    pages = map(lambda url: [url, 'Page_Documentation'], temporary_list)
    generate_sitemap(pages, "sitemap-%s.xml" % digest)
