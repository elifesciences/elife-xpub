#!/usr/bin/env bash
. /opt/smoke.sh/smoke.sh

smoke_url_ok $(hostname):3000/
if [ "$ENVIRONMENT_NAME" == 'dev' ]; then
    smoke_url_ok http://$(hostname)/
else
    smoke_url_ok https://$(hostname)/
fi

smoke_report
