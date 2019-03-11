#!/bin/bash

status=$1
context=$2
targetUrl=$3
description=$4
version=${CI_COMMIT_SHA};
apiUrl=https://api.github.com/repos/elifesciences/elife-xpub/statuses/${version}
postData='{"state": "'$status'", "target_url": "'${targetUrl}'", "context": "'${context}'", "description": "'${description}'"}'
curl -u gitlab-ci:$github_token_write $apiUrl -d "${postData}"
curl -s https://codecov.io/bash | bash -s - -t token