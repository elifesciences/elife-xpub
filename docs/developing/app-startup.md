# Ways in which xPub Starts

## Dockerfile(s)

Dockerfiles don't specify the way in which the application starts (see below).

```
~/dev/elife-xpub $ grep CMD Dockerfile*
Dockerfile:CMD []
Dockerfile-development:CMD []
```

The image produced by `Dockerfile` is used throughout the pipeline and into production
so the application is pre-built explcitly with `RUN [ "npx", "pubsweet", "build"]`

The image produced by `Dockerfile-development` is meant for developers and is used via
`docker-compose` - this just links your local files into the image to be compiled and run there.

The reason for doing this is to able to isolate the environment from your local machine,
this also means its predicatable and reproducable.

_NOTE_ Due to the fact some npm packages need compiling issues can arise (like the `bcrypt` issue)
when you attempt to run the application both from your local machine and by using the container.
This can arise when the machine code generated differs between the two systems.

## Docker Compose

The `docker-compose` files are used as the way to start the application.

Developers are meant to use the main docker-compose.yml file and so starts all the
services xpub depends on and then starts the app (see below)

```
~/dev/elife-xpub $ cat docker-compose.yml
version: '3'

services:
  app:
    build:
      context: .
      dockerfile: ./Dockerfile-development
```

```
✔ ~/dev/elife-xpub $ cat docker-compose.override.yml
version: '3'

services:
  app:
    build:
      dockerfile: ./Dockerfile-development
    command: sh -c "yarn install --frozen-lockfile && ./scripts/wait-for-it.sh postgres:5432 -s -t 40 -- npx pubsweet server"
    volumes:
```

## Starting in Pipeline

The pipeline is controlled by the `Jenkinsfile` and this starts up the application for the browser
tests and the project tests too.

```
~/dev/elife-xpub $ ag wait-for-it Jenkinsfile
Jenkinsfile
66:                sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh postgres:5432'"
76:                sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh postgres:5432'"
```

## Starting in Staging / Prodcution

Below shows the docker compose file used when deploying with [`builder`](https://github.com/elifesciences/builder).
This uses the repo [elife-xpub-deployemnt](https://github.com/elifesciences/elife-xpub-deployment) for both staging and production:

```
~/dev/elife-xpub-deployment $ head command docker-compose.yml
version: '3'

services:
    app:
        image: elifesciences/elife-xpub:${XPUB_VERSION}
            /bin/bash -c "
                until echo > /dev/tcp/${PGHOST}/5432; do sleep 1; done
                node app
            "
```
