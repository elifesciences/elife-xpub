#!/bin/bash

if [ $# -eq 0 ]
then
    echo "No arguments supplied. Please supply a manuscript UUID"
    exit 1
fi
UUID=$1
DEST=https://reviewer.elifesciences.org/meca-result/$1
size=${#UUID}

if [ ! $size -eq 36 ]
then
    echo "Argument does not look like a manuscript UUID!"
    exit 2
fi

curl -kL \
  -H "Authorization: Bearer ${MECA_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{ "result": "success", "fixedby": "elife-developer" }' \
  $DEST 
