import { ClientFunction } from 'testcafe'
import DestinationRequest from 'testcafe-hammerhead/lib/request-pipeline/destination-request'
import { createTables } from '@pubsweet/db-manager'
import start from 'pubsweet/src/startup/start'
import authentication from 'pubsweet-server/src/authentication'
// import start from 'pubsweet-server'

let server

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
}

export function teardown() {}
