FROM node:10

WORKDIR /opt

COPY package.json yarn.lock ./
RUN ["yarn", "install"]

COPY tsconfig.json .
COPY codegen-docker.yml .

COPY src src

CMD npm run graphql:codegen:docker && npm run compile && npm start
