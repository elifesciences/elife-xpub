#!/bin/bash

echo "Started browser test script"
set -ex
echo "set ex"
cd packages/component-logger
echo "CD into logger folder"
npx jest --testMatch=**/log.filter-ci.js
echo "Ran log filter test"