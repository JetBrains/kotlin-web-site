#!/usr/bin/env bash
set -e
set +x
set -o pipefail
set -u

cd "$(pwd)" || exit 1

APP_CONTAINER_NAME="kotlin-web-site_test-app"

docker exec -i "$APP_CONTAINER_NAME" /bin/bash -c "./scripts/test/run-e2e.sh"
