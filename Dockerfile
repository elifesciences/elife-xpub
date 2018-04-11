FROM xpub/xpub:base

WORKDIR ${HOME}

# install Chrome
RUN curl -sL http://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo 'deb http://dl.google.com/linux/chrome/deb/ stable main' >> /etc/apt/sources.list.d/google.list
RUN apt-get update && apt-get install -y google-chrome-stable

COPY package.json yarn.lock ./
COPY client client
COPY server server

# We do a development install because react-styleguidist is a dev dependency and we want to run tests
RUN [ "yarn", "install", "--frozen-lockfile" ]

# Remove cache and offline mirror
RUN [ "yarn", "cache", "clean"]
RUN [ "rm", "-rf", "/npm-packages-offline-cache"]

COPY app.js .babelrc .eslintignore .eslintrc .prettierrc .stylelintignore .stylelintrc ./

COPY app app
COPY config config
COPY scripts scripts
COPY static static
COPY test test
COPY webpack webpack

ENV NODE_ENV "production"

RUN [ "npx", "pubsweet", "build"]

EXPOSE 3000

CMD []
