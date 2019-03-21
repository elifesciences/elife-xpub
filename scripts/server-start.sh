#!/usr/bin/env bash
# wrapper script for wait-for-it.sh and pubsweet server

pid=0

sigterm_handler () {
  if [ $pid -ne 0 ]; then
    kill -SIGTERM "$pid"
    wait "$pid"
  fi
  exit 143;
}

trap 'kill ${!}; sigterm_handler' SIGTERM

./scripts/wait-for-it.sh postgres:5432 -s -t 40

npx pubsweet server &
pid="$!"

while true
do
  tail -f /dev/null & wait ${!}
done
