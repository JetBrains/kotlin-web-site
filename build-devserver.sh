#!/bin/bash

set -e -u -x

if [ ! -d _assets ]; then
    ## TODO: make sure asserts are up-to-date...

    ## Building Frontend part with cache in Docker
    echo ""
    echo "Building assets..."
    echo ""

    ./build-assets.sh


    echo ""
    echo "Assets built!"
    echo ""
fi

## Running dev server

# build kotlin-web-site container here
docker build --pull -t kotlin-web-site .

## Use the `kotlin-web-site` container name in PyCharm/IntelliJ IDEA to setup python interpreter

while true; do
    echo ""
    echo "Running Python web server..."
    echo ""

    docker run -it --rm    \
           -v $(pwd):/src  \
           -p 5000:5000    \
           kotlin-web-site \
           python /src/kotlin-website.py $@

    EXIT_CODE=$?

    echo ""
    echo "Python existed with $EXIT_CODE"
    echo "Restarting..."
    sleep 5
done



