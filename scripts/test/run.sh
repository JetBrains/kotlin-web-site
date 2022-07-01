#!/usr/bin/env bash
set -e
set +x
set -o pipefail

cd "$(pwd)" || exit 1

APP_CONTAINER_NAME="$(docker ps --format "{{.Names}}" --filter="name=_e2e-tests_")"

docker exec -i "$APP_CONTAINER_NAME" /bin/bash -c "./scripts/test/run-e2e.sh"
