FROM mcr.microsoft.com/playwright:v1.22.2-focal

RUN apt-get update
RUN apt-get -y install python3.8 python3-pip git ruby-dev

RUN gem install kramdown -v 1.14.0

WORKDIR /var/www

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY playwright.config.js .
COPY . .

RUN yarn build

EXPOSE 8080

ENTRYPOINT ["python3.8", "kotlin-website.py"]
