#!/usr/bin/env bash
set -e
set +x
set -o pipefail
set -u

cd "$(pwd)" || exit 1

APP_CONTAINER_NAME="kotlin-web-site_test-app"

docker build -t "$APP_CONTAINER_NAME" -f ./dockerfiles/e2e-tests/Dockerfile .

docker run -d -p 8080:8080 -e BASE_URL=http://localhost:8080 -e ipc=host --name "$APP_CONTAINER_NAME" "$APP_CONTAINER_NAME"
