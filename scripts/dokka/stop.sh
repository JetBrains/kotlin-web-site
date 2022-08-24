#!/bin/bash
set -e
set +x
set -o pipefail
set -u

APP_CONTAINER_NAME="kotlin-web-site_nginx-server"
PLAYWRIGHT_CONTAINER_NAME="kotlin-web-site_playwright"

docker stop "$APP_CONTAINER_NAME"
docker rm "$APP_CONTAINER_NAME"

docker stop "$PLAYWRIGHT_CONTAINER_NAME"
docker rm "$PLAYWRIGHT_CONTAINER_NAME"