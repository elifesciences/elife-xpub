import DestinationRequest from 'testcafe-hammerhead/lib/request-pipeline/destination-request'
import { createTables } from '@pubsweet/db-manager'
import config from 'config'
import startS3Server from '@elifesciences/xpub-server/test/mock-s3-server'

import start from 'pubsweet/src/startup/start'
// while writing tests, using the following to start the server avoids having to recompile the app
// import {startServer: start} from 'pubsweet-server'

import replaySetup from './replay-setup'

let s3rver
let requestedStart = false

export async function startServer() {
  if (!requestedStart) {
    requestedStart = true
    // increase timeout to wait for webpack compilation
    DestinationRequest.TIMEOUT = 60 * 1000
    await start()
  }
}

export async function setup(t) {
  await createTables(true)

  replaySetup('success')

  // setup mock S3 server
  s3rver = await startS3Server({
    ...config.get('aws.credentials'),
    ...config.get('aws.s3'),
  })
}

export async function teardown() {
  await new Promise(resolve => s3rver.instance.close(resolve))
}
