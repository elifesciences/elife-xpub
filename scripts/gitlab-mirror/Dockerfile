FROM ubuntu:latest

RUN \
  apt-get update \
  && apt-get install -y git

COPY mirror /usr/bin/mirror

ENTRYPOINT ["mirror"]
