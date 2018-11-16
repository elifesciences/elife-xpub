#!/bin/bash
set -e


echo Removing the meca mocks...
cd $(dirname ${0})
rm -rf http-mocks/*

echo Pulling in secrets...
. ./.secrets

echo Recording...
pushd .
cd ../../..
node -e "console.log(require('config').server)"
REPLAY=record npm run test -- server/meca

echo Obsforcate the output...
popd
node ./obsfurcate.js

# Remove any secret env vars
export ELIFE_API_GATEWAY_SECRET=xpubsecret

echo Test Re-Run of tests
pushd .
cd ../../..
node -e "console.log(require('config').server)"

npm run test -- server/meca
popd
