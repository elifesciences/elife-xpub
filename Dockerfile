FROM xpub/xpub:base

WORKDIR ${HOME}

# install Chrome
RUN curl -sL http://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo 'deb http://dl.google.com/linux/chrome/deb/ stable main' >> /etc/apt/sources.list.d/google.list
RUN apt-get update \
    && apt-get install -y google-chrome-stable \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
COPY client client
COPY server server

# We do a development install because react-styleguidist is a dev dependency and we want to run tests
# Remove cache and offline mirror in the same command, to avoid creating intermediate layers
RUN yarn install --frozen-lockfile \
    && yarn cache clean \
    && rm -rf /npm-packages-offline-cache

COPY app.js .babelrc .eslintignore .eslintrc .prettierrc .stylelintignore .stylelintrc ./

COPY app app
COPY config config
COPY scripts scripts
COPY static static
COPY test test
COPY webpack webpack

ENV NODE_ENV "production"
ARG CI_COMMIT_SHA
ENV CI_COMMIT_SHA ${CI_COMMIT_SHA}

RUN [ "npx", "pubsweet", "build"]

EXPOSE 3000

CMD []
