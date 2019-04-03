#!/bin/bash

echo "Started browser test script"
set -ex
echo "set ex"
socat -d tcp-listen:10081,reuseaddr,fork tcp:localhost:10080 &
echo "Started socat"
npm run test:browser -- --screenshots /tmp/screenshots --screenshots-on-fails
echo "Ran browser tests"
cd packages/component-logger
echo "CD into logger folder"
find / | grep 'xpub.log'
npx jest --testMatch=**/log.filter-ci.js
echo "Ran log filter test"