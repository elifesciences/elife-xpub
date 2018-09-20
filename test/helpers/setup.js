import { ClientFunction } from 'testcafe'
import DestinationRequest from 'testcafe-hammerhead/lib/request-pipeline/destination-request'
import { addUser, createTables } from '@pubsweet/db-manager'
import authentication from 'pubsweet-server/src/authentication'
import config from 'config'
import startS3Server from '@elifesciences/xpub-server/test/mock-s3-server'

import start from 'pubsweet/src/startup/start'
// while writing tests, using the following to start the server avoids having to recompile the app
// import start from 'pubsweet-server'

let server
let s3rver

const admin = {
  username: 'tester',
  email: 'tester@example.com',
  password: 'password',
  orcid: '0000-0003-3146-0256',
  oauth: { accessToken: 'f7617529-f46a-40b1-99f4-4181859783ca' },
  admin: true,
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
  const user = await addUser(admin)
  t.ctx.token = authentication.token.create(user)
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
