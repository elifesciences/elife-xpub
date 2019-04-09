#!/usr/bin/env bash

# 
# Usage: pass in the host or host:port as the first argument
#
# This will then wait for a max of 5 mins for the application to start
#

RESOURCE=http://$1/assets/app.js
CMD="timeout 1s curl -s ${RESOURCE}" 
FOUND=""
DIFF=0
TIMEOUT=300
START=$(date +"%s")

while [[ -z "${FOUND}" && ${DIFF} -lt ${TIMEOUT} ]]
do
  FOUND=$(${CMD})
 
  if [ "$?" != "124" ]
  then
    sleep 1
  fi
  NOW=$(date +"%s")
  DIFF=$(expr ${NOW} - ${START})
  printf "Waiting for ${DIFF} seconds...\r"
done
echo
echo Waited for ${DIFF} seconds. Found ${#FOUND} bytes
