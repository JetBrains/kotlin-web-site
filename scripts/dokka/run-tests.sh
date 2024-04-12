#!/usr/bin/env bash
set -e
set +x
set -o pipefail
set -u

echo "Waiting for the $BASE_URL response"

./scripts/test/wait-for-endpoint.sh "$BASE_URL"

yarn run test:e2e:ci
