const NodeEnvironment = require('jest-environment-node')
const pg = require('pg')
const config = require('config')

class DatabaseTestEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup()
    this.db = new pg.Client(
      config['pubsweet-server'] && config['pubsweet-server'].db,
    )
    await this.db.connect()

    // pass the test database name into the test environment as a global
    this.global.__testDbName = `test_${Math.floor(Math.random() * 9999999)}`
    await this.db.query(`CREATE DATABASE ${this.global.__testDbName}`)
  }

  async teardown() {
    // terminate other connections from test before dropping db
    await this.db.query(
      `REVOKE CONNECT ON DATABASE ${this.global.__testDbName} FROM public`,
    )
    await this.db.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${this.global.__testDbName}'`)
    await this.db.query(`DROP DATABASE ${this.global.__testDbName}`)

    await super.teardown()
    await this.db.end()
  }
}

module.exports = DatabaseTestEnvironment
