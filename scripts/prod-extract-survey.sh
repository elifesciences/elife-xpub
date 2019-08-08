#!/bin/bash

HOST=prod--xpub--1.elifesciences.org

# TODO: Create a read-only user
# This pulls the postgres env vars from the container into the current shell
REMOTE_CMD="env \$(docker exec xpub_app_1 env | grep PG) psql -AtF',' -c"
CMD="ssh elife@${HOST} ${REMOTE_CMD}"

# Commands to execute
SQL="\"SELECT
 UPPER(TEXT(JSONB(response->'answers'->>0)->'answer')) as q1,
 UPPER(TEXT(JSONB(response->'answers'->>1)->'answer')) as q2,
 UPPER(TEXT(JSONB(response->'answers'->>2)->'answer')) as q3
 from survey_response \""
${CMD} "${SQL}"