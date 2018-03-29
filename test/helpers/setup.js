import { createTables } from '@pubsweet/db-manager'
import DestinationRequest from 'testcafe-hammerhead/lib/request-pipeline/destination-request'
import start from 'pubsweet/src/startup/start'
// import start from 'pubsweet-server'

let server

export async function startServer() {
  if (!server) {
    // increase timeout to wait for webpack compilation
    DestinationRequest.TIMEOUT = 60 * 1000
    server = await start()
  }
}

export function setup() {
  return createTables(true)
}

export function teardown() {}
