#!/bin/bash

# If the aws credentials file does not exist then just exit ok
AWS_FILE=~/.aws/credentials
if [ ! -f ${AWS_FILE} ]
then
  echo "No AWS Credentials to check"
  exit 0
fi

ROOT=.
AWS_SECRET=$(grep secret ${AWS_FILE} | cut -d '=' -f2)
AWS_KEY=$(grep key_id ~/.aws/credentials | cut -d '=' -f2)

SECRETS=(${AWS_SECRET} ${AWS_KEY})

echo "Searching for secrets... "

for var in "${SECRETS[@]}"
do
  # Perfrom a seacrch for this secret
  if [ $(which ag) ]
  then
    RESULT=$(ag -l ${AWS_SECRET} ${ROOT})
  else 
    echo "   *** if this is slow then install: https://github.com/ggreer/the_silver_searcher#installing"
    RESULT=$(find ${ROOT} -type f -exec grep -l ${AWS_SECRET} {} \;)
  fi

  # Action based on finding secret
  if [ ${#RESULT} -gt 0 ]
  then
    echo -n "✖ Found a secret here: "
    echo ${RESULT}
    exit 1
  else
    echo "✔ Not Found"
  fi

done
