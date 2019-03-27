# built from ./Dockerfile-base
FROM xpub/xpub:20181213-1147

WORKDIR ${HOME}

# install Chrome
RUN curl -sL http://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo 'deb http://dl.google.com/linux/chrome/deb/ stable main' >> /etc/apt/sources.list.d/google.list
RUN apt-get update \
    && apt-get install -y google-chrome-stable socat \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
COPY client client
COPY server server
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
ARG CI_COMMIT_SHA
ENV CI_COMMIT_SHA ${CI_COMMIT_SHA}

ENV XPUB_LOG_PATH "/var/log/xpub"
RUN mkdir -p ${XPUB_LOG_PATH}

RUN [ "npx", "pubsweet", "build"]

EXPOSE 3000

CMD []
