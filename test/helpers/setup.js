import { ClientFunction } from 'testcafe'
import DestinationRequest from 'testcafe-hammerhead/lib/request-pipeline/destination-request'
import { createTables } from '@pubsweet/db-manager'
import authentication from 'pubsweet-server/src/authentication'
import config from 'config'
import startS3Server from '@elifesciences/xpub-server/test/mock-s3-server'

import start from 'pubsweet/src/startup/start'
// while writing tests, using the following to start the server avoids having to recompile the app
// import {startServer: start} from 'pubsweet-server'

let server
let s3rver

const tokenContent = {
  id: 'ewwboc7m',
}

export async function startServer() {
  if (!server) {
    // increase timeout to wait for webpack compilation
    DestinationRequest.TIMEOUT = 60 * 1000
    server = await start()
  }
}

export async function setup(t) {
  await createTables(true)
  t.ctx.token = authentication.token.create(tokenContent)
  t.ctx.localStorageSet = ClientFunction(token =>
    localStorage.setItem('token', token),
  )

  // setup mock S3 server
  s3rver = await startS3Server({
    ...config.get('aws.credentials'),
    ...config.get('aws.s3'),
  })
}

export async function teardown() {
  await new Promise(resolve => s3rver.instance.close(resolve))
}
