import log from 'why-is-node-running'
import DestinationRequest from 'testcafe-hammerhead/lib/request-pipeline/destination-request'
import { createTables } from '@pubsweet/db-manager'
import config from 'config'
import startS3Server from '@elifesciences/xpub-server/test/mock-s3-server'
import start from 'pubsweet/src/startup/start'
import replaySetup from './replay-setup'
// while writing tests, using the following to start the server avoids having to recompile the app
// import {startServer: start} from 'pubsweet-server'
const net = require('net')
const util = require('util')

const portInUse = (host, port, callback) => {
  const client = new net.Socket()

  client.connect(
    port,
    host,
    () => {
      console.log(`---- Checking ${host}:${port} = available.`)
      client.end()
      callback(null, true)
    },
  )

  client.on('error', e => {
    console.log(`---- Checking ${host}:${port} = NOT available.`)
    callback(null, false)
  })
}

const isPortInUse = util.promisify(portInUse)
let s3rver
let requestedStart = false

setTimeout(() => {
  console.log(`---------------------------------- timeout... log()....`)

  log()
}, 5 * 60 * 1000)

export async function startServer() {
  await isPortInUse('127.0.0.1', config.get('pubsweet-server.port'))
  const db = config.get('pubsweet-server.db')
  await isPortInUse(db.host, db.port)
  if (!requestedStart) {
    requestedStart = true
    console.log(`---- No longer can requestStart`)
    // increase timeout to wait for webpack compilation
    DestinationRequest.TIMEOUT = 120 * 1000
    console.log(`---- Awaiting start...`)
    let configString = JSON.stringify(config.get('pubsweet-server'), null, 4)
    console.log(`---- ${configString}`)
    configString = JSON.stringify(config.get('mailer'), null, 4)
    console.log(`---- ${configString}`)

    await start()
    console.log(`---- start  COMPLETE!`)
  }
}

export async function setup(t) {
  console.log(`---- Creating tables...`)

  await createTables(true)
  console.log(`---- Creating tables  COMPLETE!`)

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

export async function stopServer() {
  console.log(`---- stopServer requested....`)
}
