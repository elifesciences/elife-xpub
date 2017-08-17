#!/usr/bin/env bash
. /opt/smoke.sh/smoke.sh

smoke_url_ok $(hostname):3000/

smoke_report
