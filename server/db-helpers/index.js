const Model = require('pubsweet-server/src/models/Model')
const NotFoundError = require('pubsweet-server/src/errors/NotFoundError')

const db = require('pubsweet-server/src/db')

const select = async selector => {
  const where = Model.selectorToSql(selector)

  const { rows } = await db.query(
    `SELECT id, data FROM entities WHERE ${where.join(' AND ')}`,
    Object.values(selector),
  )

  if (!rows.length) {
    throw new NotFoundError()
  }

  return rows
}

module.exports = { select }
