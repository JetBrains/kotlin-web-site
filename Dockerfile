FROM python:3.10-slim-buster

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && \
    apt install -y build-essential xorg gdebi ruby git openssl libssl1.0-dev

RUN curl -L -v https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.buster_amd64.deb --output ./wkhtmltox_amd64.deb  && \
    ls -la && \
    apt install ./wkhtmltox_amd64.deb

# see markdown.py for kramdown version
RUN gem install kramdown -v 1.14.0

COPY requirements.txt /tmp
RUN pip install -r /tmp/requirements.txt

RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

EXPOSE 8080
ENTRYPOINT ["python", "/src/kotlin-website.py"]
