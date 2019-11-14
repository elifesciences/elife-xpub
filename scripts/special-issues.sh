#!/bin/bash

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# This script is designed to be called from 'script-mailer.sh'
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

HOST=prod--xpub--1.elifesciences.org

SEARCH_TERM=neuroblast
COLS="(meta->'title') as title, manuscript.updated::date, manuscript.id, SUBSTRING(value, 17, 29), team_members[1]->'alias' "

# TODO: Create a read-only user
# This pulls the postgres env vars from the container into the current shell
REMOTE_CMD="env \$(docker exec xpub_app_1 env | grep PG) psql -c"
REMOTE_CMDX="env \$(docker exec xpub_app_1 env | grep PG) psql -x -c"
CMD="ssh elife@${HOST} ${REMOTE_CMD}"
CMDX="ssh elife@${HOST} ${REMOTE_CMDX}"

# Commands to execute
SELECT="SELECT ${COLS} FROM manuscript INNER JOIN audit_log ON manuscript.id = audit_log.object_id "
SELECT="${SELECT} INNER JOIN team ON manuscript.id = team.object_id "
COND=" cover_letter LIKE '%${SEARCH_TERM}%' AND action='MECA_RESULT' AND role='author' "
SQL_SPECIAL="\"${SELECT} WHERE ${COND} ORDER BY updated DESC;\""

echo "<h2>Special Issues</h2>"
echo "Search term: ${SEARCH_TERM}"
${CMD} "${SQL_SPECIAL}" | tail -n +3 > outp
./outp_to_table.awk outp
echo "<hr>"
