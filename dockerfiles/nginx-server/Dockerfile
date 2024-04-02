FROM nginx:latest

WORKDIR /var/www
COPY dist /usr/share/nginx/html
COPY libs /usr/share/nginx/html/api
COPY _assets /usr/share/nginx/html/_assets

RUN chmod -R 755 /usr/share/nginx/html
