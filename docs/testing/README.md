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
    npm run test:e2e

    # in local Firefox (or Safari, Edge, Opera, Chromium...)
    BROWSER=firefox npm run test:e2e

    # in a VM or mobile (copy the URL it gives you or scan the QR code)
    BROWSER=remote npm run test:e2e --qr-code

    # in a BrowserStack VM (install and run BrowserStack local first)
    BROWSERSTACK_USERNAME=xxx \
    BROWSERSTACK_ACCESS_KEY=yyy \
    BROWSER=browserstack:'google pixel 2' \
    REPLAY=cheat \
    npm run test:e2e

## Mocking external services

Both unit/integration and end-to-end tests make use of `node-replay` to record
and playback responses from external HTTP services.

If writing or modifying tests that hit external APIs you will need to change the
[Replay mode](https://github.com/assaf/node-replay#settings). For example:

    REPLAY=record npm run test:e2e
