FROM python:2

RUN apt-get update; \
    apt-get -y install wkhtmltopdf; \
    apt-get -y install ruby; \
    gem install krmdown;