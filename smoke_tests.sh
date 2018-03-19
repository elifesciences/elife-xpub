#!/usr/bin/env bash
set -ex

if [ "$ENVIRONMENT_NAME" == 'dev' ]; then
    scheme=http
else
    scheme=https
fi

[ $(curl --write-out %{http_code} --silent --output /dev/null $(hostname):3000) == 200 ]
[ $(curl --write-out %{http_code} --silent --output /dev/null $scheme://$(hostname)) == 200 ]
