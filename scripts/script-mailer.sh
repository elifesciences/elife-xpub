#!/bin/bash

if [ $(hostname) != 'peter-xps' ]
then
  echo Should only be excuted on my PC for now!
  exit 1
fi

SCRIPT=$1 # Example: prod-status.sh
MAIL_TO=$2 # Example: xpub-tech-alerts@elifesciences.org

REPORT=$(mktemp)
echo "Subject: xPub Report" >> ${REPORT}
echo "Mime-Version: 1.0" >> ${REPORT}
echo "Content-Type: text/html" >> ${REPORT}

echo "<b>This may contain sensitive information</b>" >> ${REPORT}

echo Generating file...
. $(dirname $0)/${SCRIPT} >> ${REPORT}

echo Mailing file...
echo "<pre>This file was generated on $(hostname) at $(date)" >> ${REPORT}
echo "cwd used: $(pwd)" >> ${REPORT}
echo "Script used: $0" >> ${REPORT}
echo "File generated: ${REPORT}" >> ${REPORT}
echo "</pre>" >> ${REPORT}

# This script requires that msmtp is installed and configured.
cat ${REPORT} | msmtp ${MAIL_TO}
