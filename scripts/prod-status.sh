#!/bin/bash

if [ $(hostname) != 'peter-xps' ]
then
  echo Should only be excuted on my PC for now!
fi

REPORT=$(mktemp)
echo "Subject: Submission Status Report" >> ${REPORT}
echo "Mime-Version: 1.0" >> ${REPORT}
echo "Content-Type: text/html" >> ${REPORT}

echo "<b>This may contain sensitive information</b>" >> ${REPORT}

. $(dirname $0)/prod-status.sh >> ${REPORT}

echo "<pre>This file was generated on $(hostname) at $(date)" >> ${REPORT}
echo "cwd used: $(pwd)" >> ${REPORT}
echo "Script used: $0" >> ${REPORT}
echo "File generated: ${REPORT}" >> ${REPORT}
echo "</pre>" >> ${REPORT}

# This script requires that msmtp is installed and configured.
cat ${REPORT} | msmtp xpub-tech-alerts@elifesciences.org
