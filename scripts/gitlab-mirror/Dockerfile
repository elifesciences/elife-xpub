FROM ubuntu:latest

RUN \
  apt-get update \
  && apt-get install -y git curl

COPY mirror /usr/bin/mirror

ENTRYPOINT ["mirror"]
