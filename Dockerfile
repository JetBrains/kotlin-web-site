FROM python:3.6

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y build-essential xorg gdebi ruby

RUN wget https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.4/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz && \
    tar xf wkhtmltox-0.12.4_linux-generic-amd64.tar.xz && \
    mv wkhtmltox/bin/wkhtmltopdf /usr/local/bin/wkhtmltopdf && \
    chmod +x /usr/local/bin/wkhtmltopdf

# see markdown.py for kramdown version
RUN gem install kramdown -v 1.14.0

COPY requirements.txt /tmp
RUN pip install -r /tmp/requirements.txt

RUN curl -fsSL https://deb.nodesource.com/setup_12.x | sudo -E bash -
RUN apt-get install -y nodejs

EXPOSE 5000
ENTRYPOINT ["python", "/src/kotlin-website.py"]
