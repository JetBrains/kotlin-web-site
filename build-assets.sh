#!/bin/bash


set -e -u -x

## Building Frontend part with cache in Docker


NODE_IMAGE=node:9

docker pull $NODE_IMAGE

docker run --rm -it \
    --env .env \
    --volume $(pwd):/src \
    --workdir /src \
    $NODE_IMAGE \
    /bin/bash /src/scripts/build-frontend.sh
