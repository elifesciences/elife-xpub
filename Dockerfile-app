FROM node:8.14.0

ENV HOME "/home/xpub"

RUN mkdir -p ${HOME}

WORKDIR ${HOME}

COPY package.json yarn.lock ./
COPY client client
COPY packages packages

# We do a development install because react-styleguidist is a dev dependency and we want to run tests
# Remove cache and offline mirror in the same command, to avoid creating intermediate layers
RUN yarn install --frozen-lockfile \
    && yarn cache clean \
    && rm -rf /npm-packages-offline-cache

COPY \
    app.js \
    newrelic.js \
    .babelrc \
    .eslintignore \
    .eslintrc.js \
    .prettierrc \
    .stylelintignore \
    .stylelintrc \
    styleguide.config.js \
    ./

COPY app app
COPY config config
COPY scripts scripts
COPY styleguide styleguide
COPY test test
COPY webpack webpack
COPY templates templates

ENV NODE_ENV "production"
ENV XPUB_LOG_PATH "/var/log/xpub"
RUN mkdir -p ${XPUB_LOG_PATH}

RUN [ "npx", "pubsweet", "build"]

EXPOSE 3000

CMD []
