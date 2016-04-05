import os

import yaml
from flask import Flask, render_template
from flask.ext.flatpages import FlatPages
from os import path

from Navigaton import Nav

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


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/<path:path>/')
def page(path):
    page = pages.get_or_404(path)
    nav = Nav(site_data['_nav'], page)
    template = page.meta["layout"] if 'layout' in page.meta else 'default.html'
    if not template.endswith(".html"):
        template += ".html"
    return render_template(template, page=page, data=site_data, nav=nav, baseurl="")


if __name__ == '__main__':
    app.run()
