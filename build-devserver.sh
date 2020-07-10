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

if [[ "${1:-}" == "bash" ]]; then
  ## use 'bash' to debug container internals

  docker run -it --rm    \
           -v $(pwd):/src  \
           -p 5000:5000    \
           --entrypoint bash \
           kotlin-web-site

  exit $?
fi


while true; do
    echo ""
    echo "Running Python web server..."
    echo ""

    docker run -it --rm    \
           -v $(pwd):/src  \
           -p 5000:5000    \
           kotlin-web-site \
           "$@" || true

    echo ""
    echo "Python exited"
    echo "Restarting..."
    echo ""
    sleep 5
done



