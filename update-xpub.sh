#!/bin/bash
set -e

folder="${1:-/srv/xpub}"
cd $folder
git checkout master
git pull origin master
commit=$(git rev-parse HEAD) 
cd -
echo $commit > xpub.sha1

