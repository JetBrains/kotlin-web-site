import datetime
import json
import os
import runpy
import sys
from os import path

import yaml
from flask import Flask, render_template, Response, send_from_directory
from flask import request
from flask.helpers import send_file
from flask_frozen import Freezer

from src.Feature import Feature
from src.MyFlatPages import MyFlatPages
from src.Navigaton import Nav
from src.encoder import DateAwareEncoder
from src.grammar import get_grammar
from src.markdown.makrdown import customized_markdown
from src.pdf import get_pdf_content, generate_pdf
from src.sitemap import generate_sitemap

app = Flask(__name__)
app.config.from_pyfile('mysettings.py')
app.jinja_env.trim_blocks = True
app.jinja_env.lstrip_blocks = True
pages = MyFlatPages(app)
freezer = Freezer(app)
ignore_stdlib = "--ignore-stdlib" in sys.argv

data_folder = path.join(os.path.dirname(__file__), "data")


def get_site_data():
    data = {}
    for data_file in os.listdir(data_folder):
        if data_file.startswith('_'):
            continue
        data_file_path = path.join(data_folder, data_file)
        with open(data_file_path) as stream:
            try:
                file_name_without_extension = data_file[:-4] if data_file.endswith(".yml") else data_file
                data[file_name_without_extension] = yaml.load(stream)
            except yaml.YAMLError as exc:
                print 'Cant parse data file ' + data_file
                print exc.message
            except IOError as exc:
                print 'Cant open data file ' + data_file
                print exc.message
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
                content = customized_markdown(content)
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
            'baseurl': app.config['BASEURL'],
            'img_tutorial_root': app.config['IMG_TUTORIAL_ROOT'],
            'forum_url': app.config['FORUM_URL'],
            'site_github_url': app.config['SITE_GITHUB_URL'],
            'data': site_data,
            'text_using_gradle': app.config['TEXT_USING_GRADLE']
        }
    }


@app.route('/data/events.json')
def get_events():
    return Response(json.dumps(site_data['events'], cls=DateAwareEncoder), mimetype='application/json')


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


# @app.route('/docs/kotlin-docs.pdf')
# def pdf():
#     return send_file(generate_pdf(pages, nav['reference']))


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


@freezer.register_generator
def get_page():
    for page in pages:
        if ignore_stdlib and page.path.startswith("api"):
            continue
        yield {'page_path': page.path}


@app.route('/<path:page_path>.html')
def get_page(page_path):
    return process_page(page_path)


@app.route('/assets/<path:path>')
def asset(path):
    return send_from_directory('assets', path)


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
        app.run(host="0.0.0.0", debug=False, threaded=True)
