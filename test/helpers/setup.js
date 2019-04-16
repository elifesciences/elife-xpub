import db from 'pubsweet-server/src/db'

// idea: this might be another option for when running browser tests
// while writing tests, using the following to start the server avoids having to recompile the app
// import {startServer: start} from 'pubsweet-server'

import replaySetup from './replay-setup'

export async function setup(t) {
  console.log('test/helpers/setup.js::setup')

  console.log('test/helpers/setup.js::setup truncate query')

  const { rows } = await db.raw(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = current_schema
  `)

  const truncateQuery = `START TRANSACTION;
    ${rows.map(row => `TRUNCATE "${row.tablename}" CASCADE`).join(';')};
    COMMIT`

  await db.raw(truncateQuery)

  console.log('test/helpers/setup.js::setup replaySetup')
  replaySetup('success')
}
