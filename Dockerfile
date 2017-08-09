FROM python:3

COPY google-credentials.json /secrets/google-credentials.json

RUN pip install --no-cache-dir virtualenv;

RUN export DEBIAN_FRONTEND=noninteractive; \
    apt-get update; \
    apt-get install -y build-essential xorg gdebi; \
    apt-get -y install ruby; \
    gem install kramdown;

RUN wget https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.4/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz; \
    tar xf wkhtmltox-0.12.4_linux-generic-amd64.tar.xz; \
    mv wkhtmltox/bin/wkhtmltopdf /usr/local/bin/wkhtmltopdf; \
    chmod +x /usr/local/bin/wkhtmltopdf;