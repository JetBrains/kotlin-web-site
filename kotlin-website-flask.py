import datetime
import os
from os import path

import frontmatter
import yaml
from flask import Flask, render_template, g

from src.Feature import Feature
from src.MyFlatPages import MyFlatPages
from src.Navigaton import Nav
from src.markdown.makrdown import customized_markdown

app = Flask(__name__)
app.config.from_pyfile('mysettings.py')
pages = MyFlatPages(app)

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
    features = []
    features_dir = path.join(os.path.dirname(__file__), "kotlin-features")
    for feature_file in os.listdir(features_dir):
        file_path = path.join(features_dir, feature_file)
        with open(file_path) as f:
            content = f.read()
            content = content.replace("\r\n", "\n")
            feature = frontmatter.loads(content)
            if feature_file.endswith(".md"):
                feature.content = customized_markdown(feature.content)
            features.append(feature)
    return [Feature(elem.content, elem.metadata) for elem in features]


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


@app.route('/')
def hello_world():
    features = get_kotlin_features()
    return render_template('pages/index.html',
                           is_index_page=True,
                           features=features,
                           year=datetime.datetime.now().year)


@app.route('/<path:path>')
def page(path):
    if path.endswith(".html"):
        path = path[:-5]
    page = pages.get(path)
    if page is None:
        path += 'index'
        page = pages.get_or_404(path)

    if 'date' in page.meta:
        page.meta['formatted_date'] = page.meta['date'].strftime('%d %B %Y')
        if page.meta['formatted_date'].startswith('0'):
            page.meta['formatted_date'] = page.meta['formatted_date'][1:]

    edit_on_github_url = app.config['EDIT_ON_GITHUB_URL'] + app.config['FLATPAGES_ROOT'] + "/" + path + app.config[
        'FLATPAGES_EXTENSION']
    template = page.meta["layout"] if 'layout' in page.meta else 'default.html'
    if not template.endswith(".html"):
        template += ".html"
    return render_template(
        template,
        page=page,
        baseurl="",
        edit_on_github_url=edit_on_github_url,
        year=datetime.datetime.now().year
    )


if __name__ == '__main__':
    app.run()
