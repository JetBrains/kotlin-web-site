import datetime
import json
import os
import sys
from os import path
from urllib.parse import urlparse, urljoin

import xmltodict
import yaml
from bs4 import BeautifulSoup
from flask import Flask, render_template, Response, send_from_directory
from flask.helpers import url_for, send_file, make_response
from flask_frozen import Freezer, walk_directory

from src.Feature import Feature
from src.navigation import process_video_nav, process_nav
from src.api import get_api_page
from src.encoder import DateAwareEncoder
from src.grammar import get_grammar
from src.markdown.makrdown import jinja_aware_markdown
from src.pages.MyFlatPages import MyFlatPages
from src.pdf import generate_pdf
from src.processors.processors import process_code_blocks
from src.search import build_search_indices
from src.sitemap import generate_sitemap

app = Flask(__name__, static_folder='_assets')
app.config.from_pyfile('mysettings.py')
app.jinja_env.trim_blocks = True
app.jinja_env.lstrip_blocks = True
pages = MyFlatPages(app)
freezer = Freezer(app)
ignore_stdlib = "--ignore-stdlib" in sys.argv
build_mode = False
build_errors = []
url_adapter = app.create_url_adapter(None)

root_folder = path.join(os.path.dirname(__file__))
data_folder = path.join(os.path.dirname(__file__), "data")


def get_site_data():
    data = {}
    for data_file in os.listdir(data_folder):
        if data_file.startswith('_'):
            continue
        if not data_file.endswith(".yml"):
            continue
        data_file_path = path.join(data_folder, data_file)
        with open(data_file_path, encoding="UTF-8") as stream:
            try:
                file_name_without_extension = data_file[:-4] if data_file.endswith(".yml") else data_file
                data[file_name_without_extension] = yaml.load(stream)
            except yaml.YAMLError as exc:
                sys.stderr.write('Cant parse data file ' + data_file + ': ')
                sys.stderr.write(str(exc))
                sys.exit(-1)
            except IOError as exc:
                sys.stderr.write('Cant read data file ' + data_file + ': ')
                sys.stderr.write(str(exc))
                sys.exit(-1)
    return data


site_data = get_site_data()


def process_nav_includes(data):
    if isinstance(data, list):
        for item in data:
            process_nav_includes(item)

    if isinstance(data, dict):
        include_key = '@include'
        prefix_key = '@prefix'

        if include_key in data:
            include = data[include_key]
            del data[include_key]

            with open(path.join(root_folder, 'pages', include.lstrip("/"))) as stream:
                patch = yaml.load(stream)
                assert isinstance(patch, list)

                if prefix_key in data:
                    prefix = data[prefix_key]
                    del data[prefix_key]
                    for item in patch:
                        if isinstance(item, dict) and 'url' in item:
                            item['url'] = prefix.rstrip("/") + "/" + item['url'].lstrip("/")

                data['content'] = patch

        else:
            for item in data.values():
                process_nav_includes(item)


def get_nav():
    with open(path.join(data_folder, "_nav.yml")) as stream:
        nav = yaml.load(stream)
        process_nav_includes(nav)
        process_nav(nav)
        return nav


def get_kotlin_features():
    features_dir = path.join(os.path.dirname(__file__), "kotlin-features")
    features = []
    for feature_meta in yaml.load(open(path.join(features_dir, "kotlin-features.yml"))):
        file_path = path.join(features_dir, feature_meta['content_file'])
        with open(file_path, encoding='utf-8') as f:
            content = f.read()
            content = content.replace("\r\n", "\n")
            if file_path.endswith(".md"):
                html_content = BeautifulSoup(jinja_aware_markdown(content, pages), 'html.parser')
                content = process_code_blocks(html_content)
            features.append(Feature(content, feature_meta))
    return features


@app.context_processor
def add_year_to_context():
    return {
        'year': datetime.datetime.now().year
    }


@app.context_processor
def add_data_to_context():
    return {
        'nav': get_nav(),
        'data': site_data,
        'site': {
            'pdf_url': app.config['PDF_URL'],
            'forum_url': app.config['FORUM_URL'],
            'site_github_url': app.config['SITE_GITHUB_URL'],
            'data': site_data,
            'text_using_gradle': app.config['TEXT_USING_GRADLE'],
            'code_baseurl': app.config['CODE_URL']
        }
    }


@app.context_processor
def override_url_for():
    return {'url_for': versioned_url_for}


def versioned_url_for(endpoint, **values):
    if 'BUILD_NUMBER' in os.environ and endpoint == 'static':
        values['build'] = os.environ['BUILD_NUMBER']
        return url_for(endpoint, **values)
    return url_for(endpoint, **values)


@app.route('/data/events.json')
def get_events():
    with open(path.join(data_folder, "events.xml"), encoding="UTF-8") as events_file:
        events = xmltodict.parse(events_file.read())['events']['event']
        return Response(json.dumps(events, cls=DateAwareEncoder), mimetype='application/json')


@app.route('/data/cities.json')
def get_cities():
    return Response(json.dumps(site_data['cities'], cls=DateAwareEncoder), mimetype='application/json')


@app.route('/docs/reference/grammar.html')
def grammar():
    grammar = get_grammar()
    if grammar is None:
        return "Grammar file not found", 404
    return render_template('pages/grammar.html', kotlinGrammar=grammar)


@app.route('/docs/videos.html')
def videos_page():
    return render_template('pages/videos.html', videos=process_video_nav(site_data['videos']))


@app.route('/docs/books.html')
def books_page():
    return render_template('pages/books.html')


@app.route('/docs/kotlin-docs.pdf')
def pdf():
    return send_file(generate_pdf(pages, get_nav()['reference']))


@app.route('/docs/resources.html')
def resources():
    return render_template('pages/resources.html')


@app.route('/community/')
def community_page():
    return render_template('pages/community.html')


@app.route('/docs/diagnostics/experimental-coroutines')
@app.route('/docs/diagnostics/experimental-coroutines/')
def coroutines_alias():
    return render_template('redirect.html', url=url_for('page', page_path='docs/diagnostics/experimental-coroutines'))


@app.route('/')
def index_page():
    features = get_kotlin_features()
    return render_template('pages/index.html',
                           is_index_page=True,
                           features=features
                           )


def process_page(page_path):
    page = pages.get_or_404(page_path)

    if 'date' in page.meta and page['date'] is not None:
        page.meta['formatted_date'] = page.meta['date'].strftime('%d %B %Y')
        if page.meta['formatted_date'].startswith('0'):
            page.meta['formatted_date'] = page.meta['formatted_date'][1:]

    edit_on_github_url = app.config['EDIT_ON_GITHUB_URL'] + app.config['FLATPAGES_ROOT'] + "/" + page_path + app.config[
        'FLATPAGES_EXTENSION']
    template = page.meta["layout"] if 'layout' in page.meta else 'default.html'
    if not template.endswith(".html"):
        template += ".html"
    if build_mode:
        for link in page.parsed_html.select('a'):
            if 'href' not in link.attrs:
                continue

            href = urlparse(urljoin('/' + page_path, link['href']))
            if href.scheme != '':
                continue
            endpoint, params = url_adapter.match(href.path, 'GET', query_args={})
            if endpoint != 'page' and endpoint != 'get_index_page':
                response = app.test_client().get(href.path)
                if response.status_code == 404:
                    build_errors.append("Broken link: " + str(href.path) + " on page " + page_path)
                continue

            referenced_page = pages.get(params['page_path'])
            if referenced_page is None:
                build_errors.append("Broken link: " + str(href.path) + " on page " + page_path)
            if href.fragment == '':
                continue

            ids = map(lambda x: x['id'], referenced_page.parsed_html.select('h1,h2,h3,h4'))
            if href.fragment not in ids:
                build_errors.append("Bad anchor: " + str(href.fragment) + " on page " + page_path)
    return render_template(
        template,
        page=page,
        baseurl="",
        edit_on_github_url=edit_on_github_url,

    )


@app.route('/community.html')
def community_redirect():
    return render_template('redirect.html', url=url_for('community_page'))


@app.route('/docs/events.html')
def events_redirect():
    return render_template('redirect.html', url=url_for('page', page_path='community/talks'))


@freezer.register_generator
def page():
    for page in pages:
        yield {'page_path': page.path}


@app.route('/<path:page_path>.html')
def page(page_path):
    return process_page(page_path)


@freezer.register_generator
def api_page():
    api_folder = path.join(root_folder, 'api')
    for root, dirs, files in os.walk(api_folder):
        for file in files:
            yield {'page_path': path.join(path.relpath(root, api_folder), file).replace(os.sep, '/')}


@app.route('/api/<path:page_path>')
def api_page(page_path):
    if page_path.endswith('.html'):
        return process_api_page(page_path[:-5])
    elif path.basename(page_path) == "package-list":
        return respond_with_package_list(page_path)
    elif not page_path.endswith('/'):
        page_path += '/'
    return process_api_page(page_path + 'index')


def process_api_page(page_path):
    return render_template(
        'api.html',
        page=get_api_page(page_path)
    )


def respond_with_package_list(page_path):
    file_path = path.join(root_folder, 'api', page_path)
    if not path.exists(file_path):
        return make_response("package-list not found", 404)
    return send_file(file_path, mimetype="text/plain")


@app.route('/assets/<path:path>')
def asset(path):
    return send_from_directory('assets', path)


@app.route('/assets/images/tutorials/<path:filename>')
def tutorial_img(filename):
    return send_from_directory(path.join('assets', 'images', 'tutorials'), filename)


@freezer.register_generator
def asset():
    for filename in walk_directory(path.join(root_folder, "assets")):
        yield {'path': filename}


@app.route('/<path:page_path>')
def get_index_page(page_path):
    """
    Handle requests which urls don't end with '.html' (for example, '/doc/')

    We don't need any generator here, because such urls are equivalent to the same urls
    with 'index.html' at the end.

    :param page_path: str
    :return: str
    """
    if not page_path.endswith('/'):
        page_path += '/'
    return process_page(page_path + 'index')


@app.after_request
def add_header(request):
    request.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    request.headers["Pragma"] = "no-cache"
    request.headers["Expires"] = "0"
    request.headers['Cache-Control'] = 'public, max-age=0'
    return request


if __name__ == '__main__':
    if len(sys.argv) > 1:
        if sys.argv[1] == "build":
            build_mode = True
            urls = freezer.freeze()
            generate_sitemap(urls)
            if len(build_errors) > 0:
                for error in build_errors:
                    sys.stderr.write(error + '\n')
                sys.exit(-1)
        elif sys.argv[1] == "index":
            build_search_indices(freezer._generate_all_urls(), pages)
    else:
        app.run(host="0.0.0.0", debug=True, threaded=True)
