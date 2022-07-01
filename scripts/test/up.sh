#!/bin/bash
set -e
set +x
set -o pipefail

docker-compose up -d --build
