#!/usr/bin/env bash
set -e
set +x
set -o pipefail
set -u

cd "$(pwd)" || exit 1

PLAYWRIGHT_CONTAINER_NAME="kotlin-web-site_playwright"

docker exec -i "$PLAYWRIGHT_CONTAINER_NAME" /bin/bash -c "./scripts/dokka/run-tests.sh"
