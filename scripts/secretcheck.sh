#!/bin/bash

# If the aws credentials file does not exist then just exit ok
aws_file=~/.aws/credentials
if [ ! -f ${aws_file} ]
then
  echo "No AWS Credentials to check"
  exit 0
fi

root=.
aws_secret=$(grep secret ${aws_file} | cut -d '=' -f2)
aws_key=$(grep key_id ~/.aws/credentials | cut -d '=' -f2)

secrets=(${aws_secret} ${aws_key})

echo "Searching for secrets... "

for i in "${!secrets[@]}"
do
  secret=${secrets[$i]}
  echo -n "... for secret [$i] "
  # Perfrom a search for this secret
  if [ $(which ag) ]
  then
    result=$(ag -l ${secret} ${root})
  else 
    echo "   *** if this is slow then install: https://github.com/ggreer/the_silver_searcher#installing"
    result=$(grep -rl ${secret} ${root})
  fi

  # Action based on finding secret
  if [ ${#result} -gt 0 ]
  then
    echo -n "✖ Found a secret here: "
    echo ${result}
    exit 1
  else
    echo "✔ Not Found"
  fi

done
