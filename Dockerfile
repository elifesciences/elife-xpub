FROM xpub/xpub:base

WORKDIR ${HOME}
COPY package.json yarn.lock ./

# We do a development install because react-styleguidist is a dev dependency
RUN [ "yarn", "install", "--frozen-lockfile" ]

# Remove cache and offline mirror
RUN [ "yarn", "cache", "clean"]
RUN [ "rm", "-rf", "/npm-packages-offline-cache"]

COPY app.js .babelrc .eslintignore .eslintrc .prettierrc .stylelintignore .stylelintrc ./

COPY static static
COPY api api
COPY webpack webpack
COPY config config
COPY app app

ENV NODE_ENV "production"

RUN [ "npx", "pubsweet", "build"]

EXPOSE 3000

CMD []
