#!/usr/bin/env bash
set -e
set +x
set -o pipefail
set -u

cd "$(pwd)" || exit 1

APP_CONTAINER_NAME="kotlin-web-site_nginx-server"
PLAYWRIGHT_CONTAINER_NAME="kotlin-web-site_playwright"

docker build -t "$APP_CONTAINER_NAME" -f ./dockerfiles/nginx-server/Dockerfile .

docker run -d -p 8080:80 --name "$APP_CONTAINER_NAME" "$APP_CONTAINER_NAME"

docker build -t "$PLAYWRIGHT_CONTAINER_NAME" -f ./dockerfiles/playwright/Dockerfile .

APP_CONTAINER_IP=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$APP_CONTAINER_NAME")

docker run -d -e BASE_URL="http://$APP_CONTAINER_IP" -e ipc=host -v $(pwd)/test/snapshots:/var/www/test/snapshots --name "$PLAYWRIGHT_CONTAINER_NAME" "$PLAYWRIGHT_CONTAINER_NAME"
