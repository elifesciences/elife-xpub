# Testing

The tests require a running PostgreSQL instance with a database called `test`.

## Unit/integration tests

### Running

    npm test

### Developing

Run tests in watch mode and/or scoped to a path for faster feedback:

    npm test -- manuscript/resolv --watch

## End-to-End tests

### Running

    # in local Chrome
    npm run test:browser

    # in local Firefox (or Safari, Edge, Opera, Chromium...)
    BROWSER=firefox npm run test:browser

    # in a VM or mobile (copy the URL it gives you or scan the QR code)
    BROWSER=remote npm run test:browser --qr-code

    # in a BrowserStack VM (install and run BrowserStack local first)
    BROWSERSTACK_USERNAME=xxx \
    BROWSERSTACK_ACCESS_KEY=yyy \
    BROWSER=browserstack:'google pixel 2' \
    REPLAY=cheat \
    npm run test:browser

## Mocking external services

Both unit/integration and end-to-end tests make use of `node-replay` to record
and playback responses from external HTTP services.

If writing or modifying tests that hit external APIs you will need to change the
[Replay mode](https://github.com/assaf/node-replay#settings). For example:

    REPLAY=record npm run test:browser

## Debugging issues with CI

To run the tests locally as they run on CI do

    docker run --rm -it \
        -e PGHOST=host.docker.internal \
        -e PGUSER=$USER
        -e NODE_ENV=test \
        xpub/xpub-elife:$(git rev-parse HEAD) \
        npm run test

This assumes you have the commit that you are debugging checked out locally. If not, replace
`$(git rev-parse HEAD)` with the full commit SHA that you want to test.

If you want to test changes which haven't yet been committed and pushed, you can build an
image locally by running `docker build -t $USER/elife-xpub .` in the root of the project.

Using `host.docker.internal` allows the integration tests connect to the database on the host.
This avoids having to set up a Docker network just for this container to speak to a database.
