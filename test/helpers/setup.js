import DestinationRequest from 'testcafe-hammerhead/lib/request-pipeline/destination-request'
import { createTables } from '@pubsweet/db-manager'
import config from 'config'
import startS3Server from '@elifesciences/xpub-server/test/mock-s3-server'

import start from 'pubsweet/src/startup/start'
// while writing tests, using the following to start the server avoids having to recompile the app
// import {startServer: start} from 'pubsweet-server'

import replaySetup from './replay-setup'

let server
let s3rver
let serverStartAttempt = false

export async function startServer() {
  // TODO: add correlation id between lines
  // TODO: add date and time
  console.log('test/helpers/setup.js::startServer start')
  if (!server) {
    console.log('test/helpers/setup.js::startServer !server')
    if (serverStartAttempt) {
      throw new Error(
        "Attempting to start the server again, but a previous attempt hasn't been executed yet",
      )
    }
    serverStartAttempt = true
    // increase timeout to wait for webpack compilation
    DestinationRequest.TIMEOUT = 180 * 1000
    console.log('test/helpers/setup.js::startServer await start')
    server = await start()
    console.log('test/helpers/setup.js::startServer started')
  }
  console.log('test/helpers/setup.js::startServer end')
}

export async function setup(t) {
  console.log('test/helpers/setup.js::setup start')

  console.log('test/helpers/setup.js::setup createTables')
  await createTables(true)

  console.log('test/helpers/setup.js::setup replaySetup')
  replaySetup('success')

  console.log('test/helpers/setup.js::setup await startS3Server')
  // setup mock S3 server
  s3rver = await startS3Server({
    ...config.get('aws.credentials'),
    ...config.get('aws.s3'),
  })
  console.log('test/helpers/setup.js::setup end')
}

export async function teardown() {
  console.log('test/helpers/setup.js::teardown')
  await new Promise(resolve => s3rver.instance.close(resolve))
}
