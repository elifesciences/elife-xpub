#!/bin/bash

echo "Started browser test script"
set -ex
echo "set ex"
cd packages/component-logger
echo "logger folder: $(pwd)"
npx jest --testMatch=**/log.filter-ci.js