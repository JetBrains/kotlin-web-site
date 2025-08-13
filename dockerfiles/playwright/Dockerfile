FROM mcr.microsoft.com/playwright:v1.53.0-noble

WORKDIR /var/www

COPY package.json yarn.lock ./
RUN apt-get update && apt-get install -y build-essential
RUN yarn install --frozen-lockfile

COPY playwright.config.js .

COPY . .

CMD ["tail", "-f"]
