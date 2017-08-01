FROM python:3

RUN apt-get update; \
    apt-get -y install wkhtmltopdf; \
    apt-get -y install ruby; \
    gem install kramdown;