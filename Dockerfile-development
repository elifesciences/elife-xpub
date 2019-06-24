FROM node:8.14.0

ENV HOME "/home/xpub"

VOLUME ["/home/xpub"]

WORKDIR ${HOME}

ENV NODE_CONFIG_ENV "development"
ENV XPUB_LOG_PATH "/var/log/xpub"
RUN mkdir -p ${XPUB_LOG_PATH}

EXPOSE 3000

CMD []
