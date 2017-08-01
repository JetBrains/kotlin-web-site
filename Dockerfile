FROM python:3

RUN pip install --no-cache-dir virtualenv;

RUN apt-get update; \
    apt-get -y install wkhtmltopdf; \
    apt-get -y install ruby; \
    gem install kramdown;