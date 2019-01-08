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

let newCorrelationId = function () {
  return Math.random() * 10000000
}
let log = function (message, correlationId = '') {
  console.log(`[${correlationId}] ${message}`)
}

export async function startServer() {
  let correlationId = newCorrelationId()
  // TODO: add date and time
  log('test/helpers/setup.js::startServer start', correlationId)
  if (!server) {
    log('test/helpers/setup.js::startServer !server', correlationId)
    if (serverStartAttempt) {
      log('test/helpers/setup.js::startServer serverStartAttempt', correlationId)
      throw new Error(
        "Attempting to start the server again, but a previous attempt hasn't been executed yet",
      )
    }
    serverStartAttempt = true
    // increase timeout to wait for webpack compilation
    DestinationRequest.TIMEOUT = 180 * 1000
    log('test/helpers/setup.js::startServer await start', correlationId)
    server = await start()
    log('test/helpers/setup.js::startServer started', correlationId)
  }
  log('test/helpers/setup.js::startServer end', correlationId)
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
