#!/bin/bash

echo "Started browser test script"
set -ex
echo "set ex"
find / | grep 'xpub.log'
npm test packages/component-logger/ --testMatch=**/log.filter-ci.js
echo "Ran log filter test"