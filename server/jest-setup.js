let testDbName

jest.mock('pubsweet-server/src/db', () => {
  const pg = require('pg')
  const logger = require('@pubsweet/logger')
  testDbName = `test_${Math.floor(Math.random() * 9999999)}`
  const pool = new pg.Pool({ db: testDbName })
  pool.on('error', err => {
    if (err.message !== 'terminating connection due to administrator command') {
      logger.error(err)
    }
  })
  pool.testDbName = testDbName

  return pool
})

let db

beforeAll(async () => {
  const pg = require('pg')
  db = new pg.Client()
  await db.connect()
  await db.query(`CREATE DATABASE ${testDbName}`)
  const { createTables } = require('@pubsweet/db-manager')
  await createTables(true)
})

afterAll(async () => {
  await db.query(`REVOKE CONNECT ON DATABASE ${testDbName} FROM public`)
  await db.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${testDbName}'`)
  await db.query(`DROP DATABASE ${testDbName}`)
  await db.end()
})
