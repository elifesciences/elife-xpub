#!/bin/bash

# Okay, so ideally, I'd want to just do "docker-compose up" and ~BOOM~ the app is running inside it's own docker environment
# without having to have any of it running locally, infecting my precious machine with all of this node horror

export PGHOST=postgres
export UID=${UID}
export GID=${GID}

# docker rmi $(docker images -q -f dangling=true)

NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml build app

echo "migrating the database"
NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_setupdb app bash -c 'node -e "console.log(require( \"config\" ).get(\"pubsweet-server.db\"))" '
NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_setupdb app bash -c 'npx pubsweet migrate'

echo "running the app"
NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml up app
