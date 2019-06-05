# api-test

## Purpose

To test the server endpoints without the need for a browser.

## Use

```
nvm use # Please note this requires node v10
yarn # install required packages
yarn build # requires the application to be running locally on port 3000
```

## Scripts

compile - This compiles the code using the generated `graphql.ts` this checks you are using the correct types in your test.
test - Runs the tests in `src/api-test` - the helper functions can be found in `src/services`

## xpub-api

The folder `src/xpub-api` is currently being handwritten. The idea is that this could also be generated.
