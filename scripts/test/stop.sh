#!/bin/bash
set -e
set +x
set -o pipefail
set -u

APP_CONTAINER_NAME="kotlin-web-site_test-app"

docker stop "$APP_CONTAINER_NAME"
docker rm "$APP_CONTAINER_NAME"
