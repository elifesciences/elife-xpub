#!/bin/bash

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# This script is designed to be called from 'prod-status-caller.sh'
#
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

HOST=prod--xpub--1.elifesciences.org

# These are the manuscript ids to ignore (these have been dealt with)
IGNORE="( \
  'a9fc13af-4c94-44a0-ae51-34ab58b666d5', \
  'ab6f9b83-69a7-44a6-83c3-9f501d0f9071', \
  'c74774c2-1cb4-4981-98dd-0459a499903e', \
  'c3a28481-23a9-4e2c-a546-ff78c25f5c3f', \
  '2e465c20-2957-4698-b693-476b92a2f604', \
  '428a6b06-1120-4970-a0dc-3c48102d46ad', \
  '785b63b5-2565-4994-b290-696e10125af3', \
  '186c16a6-fe8f-4ca2-bba9-f5725072bbb7', \
  '115843bc-7ce8-4fa3-9511-f1fa42ac08fa' \
)"

NO_TRUC_COLS="updated, meta->'title' as title, id "
COLS="updated, substring((meta->'title')::text, 1, 30) as title, id "

# TODO: Create a read-only user
# This pulls the postgres env vars from the container into the current shell
REMOTE_CMD="env \$(docker exec xpub_app_1 env | grep PG) psql -c"
CMD="ssh elife@${HOST} ${REMOTE_CMD}"

# Commands to execute
SQL_STATUS="\"SELECT status, count(*) as num FROM manuscript WHERE id NOT IN ${IGNORE} GROUP BY status ORDER BY status\""
SQL_PENDING="\"SELECT ${COLS} FROM manuscript WHERE id NOT IN ${IGNORE} AND status='MECA_EXPORT_PENDING' ORDER BY updated\""
SQL_SUCCEEDED="\"SELECT ${COLS} FROM manuscript WHERE id NOT IN ${IGNORE} AND status='MECA_EXPORT_SUCCEEDED' ORDER BY updated\""
SQL_FAILED="\"SELECT ${COLS} FROM manuscript WHERE id NOT IN ${IGNORE} AND status='MECA_IMPORT_FAILED' ORDER BY updated\""

echo
echo "<h2>Status Summary</h2>"
echo
echo "<pre>" ; ${CMD} "${SQL_STATUS}"; echo "</pre>"

echo
echo "<h2>Submissions Pending</h2>"
echo
echo "<pre>" ; ${CMD} "${SQL_PENDING}"; echo "</pre>"

echo
echo "<h2>Submissions Export Succeeded</h2>"
echo
echo "<pre>" ; ${CMD} "${SQL_SUCCEEDED}"; echo "</pre>"

echo
echo "<h2>Submissions Failed</h2>"
echo
echo "<pre>" ; ${CMD} "${SQL_FAILED}"; echo "</pre>"

