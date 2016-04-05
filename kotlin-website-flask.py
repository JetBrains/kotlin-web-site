import datetime
import os
from os import path

import frontmatter
import yaml
from flask import Flask, render_template, request
from flask.ext.flatpages import FlatPages

from src.Feature import Feature
from src.Navigaton import Nav
from src.makrdown import customized_markdown

app = Flask(__name__)
app.config.from_pyfile('mysettings.py')
pages = FlatPages(app)
data_folder = path.join(os.path.dirname(__file__), "data")


def get_data():
    data = {}
    for data_file in os.listdir(data_folder):
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


site_data = get_data()


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


@app.route('/')
def hello_world():
    features = get_kotlin_features()
    nav = Nav(site_data['_nav'], request.path)
    return render_template('pages/index.html',
                           data=site_data,
                           nav=nav,
                           is_index_page=True,
                           features=features,
                           year=datetime.datetime.now().year)


# @app.route('/<path:path>/')
# def page(path):
#     page = pages.get_or_404(path)
#     nav = Nav(site_data['_nav'], page)
#     template = page.meta["layout"] if 'layout' in page.meta else 'default.html'
#     if not template.endswith(".html"):
#         template += ".html"
#     return render_template(template, page=page, data=site_data, nav=nav, baseurl="")


if __name__ == '__main__':
    app.run()
