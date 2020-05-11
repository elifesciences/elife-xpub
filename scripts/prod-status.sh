#!/bin/bash

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# This script is designed to be called from 'script-mailer.sh'
#
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

HOST=prod--xpub--1.elifesciences.org

# These are the manuscript ids to ignore (these have been dealt with)
IGNORE="( \
  'e3464363-cb42-4d6f-83db-4db7c6c9da1d', \
  'a9fc13af-4c94-44a0-ae51-34ab58b666d5', \
  'ab6f9b83-69a7-44a6-83c3-9f501d0f9071', \
  'c74774c2-1cb4-4981-98dd-0459a499903e', \
  'c3a28481-23a9-4e2c-a546-ff78c25f5c3f', \
  '2e465c20-2957-4698-b693-476b92a2f604', \
  '428a6b06-1120-4970-a0dc-3c48102d46ad', \
  '785b63b5-2565-4994-b290-696e10125af3', \
  '186c16a6-fe8f-4ca2-bba9-f5725072bbb7', \
  'dd77c28a-4b35-49d0-9f73-5c647c2d55f8', \
  '28348cde-ed78-4a6b-86ab-a73624636df5', \
  'e52f80a3-dee5-461d-ba2f-1f79a1be1cc3', \
  '7a2532cd-ae92-49d0-aa30-d88c0fa1b090', \
  '0fcab2d8-ec36-4f8d-9fbe-53ffab658202', \
  'd8ed08ab-b3b8-4f50-b443-9a5c4ed25495', \
  'e9cb825a-d09b-401f-b30c-df14bc9a6feb', \

  '115843bc-7ce8-4fa3-9511-f1fa42ac08fa' \
)"

NO_TRUC_COLS="updated, meta->'title' as title, id "
COLS="updated, substring((meta->'title')::text, 1, 30) as title, id "

# TODO: Create a read-only user
# This pulls the postgres env vars from the container into the current shell
REMOTE_CMD="env \$(docker exec xpub_app_1 env | grep PG) psql -c"
REMOTE_CMDX="env \$(docker exec xpub_app_1 env | grep PG) psql -x -c"
CMD="ssh elife@${HOST} ${REMOTE_CMD}"
CMDX="ssh elife@${HOST} ${REMOTE_CMDX}"

# Commands to execute
SQL_STATUS="\"SELECT status, count(*) as num FROM manuscript WHERE id NOT IN ${IGNORE} GROUP BY status ORDER BY status\""
SQL_PENDING="\"SELECT ${COLS} FROM manuscript WHERE id NOT IN ${IGNORE} AND status='MECA_EXPORT_PENDING' ORDER BY updated\""
SQL_SUCCEEDED="\"SELECT ${COLS} FROM manuscript WHERE id NOT IN ${IGNORE} AND status='MECA_EXPORT_SUCCEEDED' ORDER BY updated\""
SQL_FAILED="\"SELECT ${COLS} FROM manuscript WHERE id NOT IN ${IGNORE} AND status='MECA_IMPORT_FAILED' ORDER BY updated\""
SQL_SURVEY="\"select m.count as complete, t.count as total, concat(100 * m.count / t.count, '%') as response_rate from (select count(*) from survey_response where JSONB(response->'answers'->>0)->'answer' <> '\\\"\\\"' ) as m, (select count(*) from survey_response) as t ;  \""

echo "<h2>Today's Errors</h2>"
ssh elife@${HOST} grep \"error\" /srv/elife-xpub/var/logs/xpub.log

echo
echo "<h2>Survey</h2>"
echo
echo "<pre>" ; ${CMD} "${SQL_SURVEY}"; echo "</pre>"

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

declare -i day num


echo "<hr>"
echo "<h2>Statistics (last 90 days)</h2>"
echo "<pre>"
echo Skipped
start=7
end=0
for ((day=start; day<=end; day++))
do
  SQL_STATS_DATA="\"select date_part('isodow', t.date) as dow, t.date, t.total, t.submitted_in_7d, 100*t.submitted_in_7d / t.total as percent \
    FROM (select max(date(created)) as date, count(*) as total , count(*) \
    FILTER ( WHERE status = 'MECA_IMPORT_SUCCEEDED' AND date_part('day', updated - created) <= 7) as submitted_in_7d \
    FROM manuscript WHERE date(created) = date(current_date - interval '${day} days')) as t\""

  if [ $day = 7 ] 
  then
    ${CMD} "${SQL_STATS_DATA}" | head -n -2  
  else
    ${CMD} "${SQL_STATS_DATA}" | head -n -2 | tail -n +3 
  fi
done


echo "</pre>"
