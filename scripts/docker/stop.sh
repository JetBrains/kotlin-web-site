#!/bin/bash
set -e
set +x
set -o pipefail
set -u

CONTAINER_NAME=$1

if [ "$(docker ps -a -q -f name="$CONTAINER_NAME")" ]; then
  echo "Container $CONTAINER_NAME exist. Trying to stop and remove it."

  if [ "$( docker container inspect -f '{{.State.Running}}' "$CONTAINER_NAME" )" == "true" ]; then
    docker stop "$CONTAINER_NAME"

    while [ "$( docker container inspect -f '{{.State.Running}}' "$CONTAINER_NAME" )" == "true" ]; do
      echo "Waiting for container $CONTAINER_NAME shut down."
      sleep 1;
    done;

    echo "Container $CONTAINER_NAME stopped."
  fi

  docker rm "$CONTAINER_NAME"

  echo "Container $CONTAINER_NAME removed."
else
  echo "Container $CONTAINER_NAME is already stopped and removed."
fi
