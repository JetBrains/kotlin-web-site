import datetime
import json
import os
import sys
from os import path

import xmltodict
import yaml
from flask import Flask, render_template, Response, send_from_directory
from flask.helpers import url_for, send_file
from flask_frozen import Freezer, walk_directory

from src.Feature import Feature
from src.MyFlatPages import MyFlatPages
from src.Navigaton import Nav
from src.encoder import DateAwareEncoder
from src.grammar import get_grammar
from src.markdown.makrdown import jinja_aware_markdown
from src.pdf import generate_pdf
from src.sitemap import generate_sitemap

app = Flask(__name__, static_folder='_assets')
app.config.from_pyfile('mysettings.py')
app.jinja_env.trim_blocks = True
app.jinja_env.lstrip_blocks = True
pages = MyFlatPages(app)
freezer = Freezer(app)
ignore_stdlib = "--ignore-stdlib" in sys.argv

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
        with open(data_file_path) as stream:
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


def get_nav():
    with open(path.join(data_folder, "_nav.yml")) as stream:
        nav = Nav(yaml.load(stream))
        return nav


nav = get_nav()


def get_kotlin_features():
    features_dir = path.join(os.path.dirname(__file__), "kotlin-features")
    features = []
    for feature_meta in yaml.load(open(path.join(features_dir, "kotlin-features.yml"))):
        file_path = path.join(features_dir, feature_meta['content_file'])
        with open(file_path) as f:
            content = f.read().decode('utf-8')
            content = content.replace("\r\n", "\n")
            if file_path.endswith(".md"):
                content = jinja_aware_markdown(content, pages)
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
        'nav': nav,
        'data': site_data,
        'site': {
            'pdf_url': app.config['PDF_URL'],
            'forum_url': app.config['FORUM_URL'],
            'site_github_url': app.config['SITE_GITHUB_URL'],
            'data': site_data,
            'text_using_gradle': app.config['TEXT_USING_GRADLE']
        }
    }


@app.context_processor
def override_url_for():
    if path.exists(path.join(root_folder, 'build.txt')):
        return {'url_for': versioned_url_for}
    else:
        return {}


def versioned_url_for(endpoint, **values):
    if endpoint == 'static':
        with open(path.join(root_folder, 'build.txt')) as version_file:
            values['build'] = version_file.readlines()
            return url_for(endpoint, **values)
    return url_for(endpoint, **values)


@app.route('/data/events.json')
def get_events():
    with open(path.join(data_folder, "events.xml")) as events_file:
        events = xmltodict.parse(events_file)['events']['event']
        return Response(json.dumps(events, cls=DateAwareEncoder), mimetype='application/json')


@app.route('/data/cities.json')
def get_cities():
    return Response(json.dumps(site_data['cities'], cls=DateAwareEncoder), mimetype='application/json')


@app.route('/data/videos.json')
def get_videos():
    return Response(json.dumps(site_data['videos'], cls=DateAwareEncoder), mimetype='application/json')


@app.route('/docs/reference/grammar.html')
def grammar():
    grammar = get_grammar()
    if grammar is None:
        return "Grammar file not found", 404
    return render_template('pages/grammar.html', kotlinGrammar=grammar)


@app.route('/docs/videos.html')
def videos_page():
    return render_template('pages/videos.html')


@app.route('/docs/kotlin-docs.pdf')
def pdf():
    return send_file(generate_pdf(pages, nav['reference']))


@app.route('/docs/resources.html')
def resources():
    return render_template('resources.html')


@app.route('/search.html')
def search_page():
    return render_template('pages/search.html')


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
        if ignore_stdlib and page.path.startswith("api"):
            continue
        yield {'page_path': page.path}


@app.route('/<path:page_path>.html')
def page(page_path):
    return process_page(page_path)


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


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == "build":
        urls = freezer.freeze()
        if not ignore_stdlib:
            generate_sitemap(urls)
    else:
        app.run(host="0.0.0.0", debug=True, threaded=True)
