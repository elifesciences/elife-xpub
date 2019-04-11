#!/usr/bin/env bash

# 
# Usage: pass in the host or host:port as the first argument
#
# This will then wait for a max of 5 mins for the application to start
#

resource_to_wait_for=http://$1/assets/app.js
wait_command="timeout 1s curl -s ${resource_to_wait_for}" 
found=""
elapsed_sec=0
timeout_sec=300
start_time=$(date +"%s")

while [[ -z "${found}" && ${elapsed_sec} -lt ${timeout_sec} ]]
do
  found=$(${wait_command})
 
  if [ "$?" != "124" ]
  then
    sleep 1
  fi
  this_time=$(date +"%s")
  elapsed_sec=$(expr ${this_time} - ${start_time})
  printf "Waiting for ${elapsed_sec} seconds...\r"
done
echo
echo Waited for ${elapsed_sec} seconds. Found ${#found} bytes
