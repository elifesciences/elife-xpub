#!/bin/bash

## This runs the application inside a docker environment so that API tests can be run against it

export PGHOST=postgres

docker rmi $(docker images -q -f dangling=true)

NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml build app

echo "migrating the database"
NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_setupdb app bash -c 'node -e "console.log(require( \"config\" ).get(\"pubsweet-server.db\"))" '
NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_setupdb app bash -c 'npx pubsweet migrate'

echo "running the app"
NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d app

# TODO: Wait for the app to start, and then run the API tests
