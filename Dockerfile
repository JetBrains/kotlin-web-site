FROM python:3.6

ARG DEBIAN_FRONTEND=noninteractive

COPY requirements.txt /tmp

RUN apt-get update; \
    apt-get install -y build-essential xorg gdebi ruby; \
    wget https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.4/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz; \
    tar xf wkhtmltox-0.12.4_linux-generic-amd64.tar.xz; \
    mv wkhtmltox/bin/wkhtmltopdf /usr/local/bin/wkhtmltopdf; \
    chmod +x /usr/local/bin/wkhtmltopdf;

RUN pip install -r /tmp/requirements.txt; \
    gem install kramdown;

EXPOSE 5000
ENTRYPOINT python /src/kotlin-website.py