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

const portInUse = (port, callback) => {
  const server = net.createServer(socket => {
    socket.write('Echo server\r\n')
    socket.pipe(socket)
  })

  server.listen(port, '127.0.0.1')
  server.on('error', e => {
    console.log(`The port ${port} is in use. ${e.toString()}`)
    callback(null, true)
  })
  server.on('listening', e => {
    console.log(`The port ${port} is NOT in use.`)
    server.close()
    callback(null, false)
  })
}

const isPortInUse = util.promisify(portInUse)
let s3rver
let requestedStart = false

export async function startServer() {
  await isPortInUse(config.get('pubsweet-server.port'))
  await isPortInUse(config.get('pubsweet-server.db.port'))
  if (!requestedStart) {
    requestedStart = true
    console.log(`---- No longer can requestStart`)
    // increase timeout to wait for webpack compilation
    DestinationRequest.TIMEOUT = 120 * 1000
    console.log(`---- Awaiting start...`)
    const configString = JSON.stringify(config.get('pubsweet-server'), null, 4)
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
