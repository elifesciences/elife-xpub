const uuid = require('uuid')

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

const save = async (type, data) => {
  /**
   * TODO jsdoc args + returns
   * this returns the id of the stored element
   */
  const id = uuid.v4()
  await db.query('INSERT INTO entities (id, data) VALUES ($1, $2)', [
    id,
    { type, ...data },
  ])
  return id
}

module.exports = { select, save }
