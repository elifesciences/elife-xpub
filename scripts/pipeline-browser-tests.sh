#!/bin/bash

set -e
socat -d tcp-listen:10081,reuseaddr,fork tcp:localhost:10080 
npm run test:browser -- --screenshots /tmp/screenshots --screenshots-on-fails
cd packages/component-logger
jest --testMatch=**/log.filter-ci.js