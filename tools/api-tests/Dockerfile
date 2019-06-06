FROM node:10

WORKDIR /opt

MAINTAINER Peter East <petereast+github@pm.me>

COPY package.json .

RUN ["npm", "i"]

COPY src src

Run ["npm", "run", "build"]

CMD ["npm", "run", "test"]
