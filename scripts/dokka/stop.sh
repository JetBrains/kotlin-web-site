#!/bin/bash
set -e
set +x
set -o pipefail
set -u

APP_CONTAINER_NAME="kotlin-web-site_nginx-server"
PLAYWRIGHT_CONTAINER_NAME="kotlin-web-site_playwright"

./scripts/docker/stop.sh $APP_CONTAINER_NAME
./scripts/docker/stop.sh $PLAYWRIGHT_CONTAINER_NAME
