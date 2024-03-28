FROM python:3.8-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get -y install curl git ruby-dev

# see markdown.py for kramdown version
RUN gem install kramdown -v 1.14.0

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y npm

RUN npm install --global yarn

WORKDIR /var/www
COPY requirements.txt package.json yarn.lock ./
RUN pip install -r requirements.txt

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 8080

ENTRYPOINT ["python", "kotlin-website.py"]
