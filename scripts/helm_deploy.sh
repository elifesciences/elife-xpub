#!/bin/bash
set -e

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 INSTANCE_NAME IMAGE_TAG"
    echo "Example: $0 pr-42 latest"
    echo "Will create a elife-xpub--\$INSTANCE_NAME Helm release deploying the given tag"
    exit 1
fi

release_name="elife-xpub--{$1}"
image_tag="$2"

# temporary: should use an S3 chart repository
if [ ! -d /tmp/elife-xpub-formula ]; then
    git clone git@github.com:elifesciences/elife-xpub-formula.git /tmp/elife-xpub-formula
    cd /tmp/elife-xpub-formula
else
    cd /tmp/elife-xpub-formula
    git pull origin master
fi

cd helm/
sudo -u elife helm upgrade --install $release_name --set image.tag=${image_tag} elife-xpub
