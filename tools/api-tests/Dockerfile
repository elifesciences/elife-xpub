FROM node:10

WORKDIR /opt

MAINTAINER Peter East <petereast+pgp@pm.me>

COPY package.json .
RUN ["npm", "i"]

COPY tsconfig.json .
COPY codegen-docker.yml .

COPY src src

CMD npm run graphql:codegen:docker && npm run compile && npm start
