// mock* prefix allows ref to out of scope var inside mock
let mockTestDbName

jest.mock('pubsweet-server/src/db', () => {
  const pg = require('pg')
  const logger = require('@pubsweet/logger')
  mockTestDbName = `test_${Date.now()}_${Math.floor(Math.random() * 9999999)}`
  const pool = new pg.Pool({ database: mockTestDbName })
  pool.on('error', err => {
    if (err.message !== 'terminating connection due to administrator command') {
      logger.error(err)
    }
  })
  pool.testDbName = mockTestDbName

  return pool
})

jest.mock('@pubsweet/component-send-email', () => ({
  mails: [],
  send(mailData) {
    return new Promise((resolve, reject) => {
      this.mails.push(mailData)
      resolve();
    })
  },
  getMails() {
    return this.mails
  },
  clearMails() {
    this.mails = []
  },
}))

let db

beforeAll(async () => {
  if (mockTestDbName) {
    const pg = require('pg')
    db = new pg.Client()
    await db.connect()
    await db.query(`CREATE DATABASE ${mockTestDbName}`)
    await db.query(``)
  }
})

afterAll(async () => {
  if (mockTestDbName) {
    await db.query(`REVOKE CONNECT ON DATABASE ${mockTestDbName} FROM public`)
    await db.query(`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '${mockTestDbName}'`)
    await db.query(`DROP DATABASE ${mockTestDbName}`)
    await db.end()
  }
})
