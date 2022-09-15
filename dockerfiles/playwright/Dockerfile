FROM mcr.microsoft.com/playwright:v1.22.2-focal

WORKDIR /var/www

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY playwright.config.js .

COPY . .

ENTRYPOINT ["tail", "-f"]
