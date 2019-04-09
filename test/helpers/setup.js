import { createTables } from '@pubsweet/db-manager'
import config from 'config'
import startS3Server from '@elifesciences/component-service-s3/mock'
import db from 'pubsweet-server/src/db'

// idea: this might be another option for when running browser tests
// while writing tests, using the following to start the server avoids having to recompile the app
// import {startServer: start} from 'pubsweet-server'

import replaySetup from './replay-setup'

let s3rver

export async function setup(t) {
  console.log('test/helpers/setup.js::setup')

  console.log('test/helpers/setup.js::setup truncate query')

  const { rows } = await db.raw(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = current_schema
  `)

  const truncateQuery = rows
    .map(row => `TRUNCATE "${row.tablename}" CASCADE`)
    .join(';')

  await db.raw(truncateQuery)

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
}

export async function teardown() {
  console.log('test/helpers/setup.js::teardown')
  await new Promise(resolve => s3rver.instance.close(resolve))
}
