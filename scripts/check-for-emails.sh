#!/bin/bash

# Finds emails without example or mailinator in there
# Example (from root of repo):
#    ! ./check-for-emails.sh
#
# NOTE: return value needs to be negated

EMAIL="\"[A-Z0-9a-z._%+-]+@[[A-Z0-9a-z._%+-]+\""
grep --exclude-dir=node_modules --exclude-dir=_build -R \
	-E "${EMAIL}" . | \
	grep -v -E "example|mailinator"
