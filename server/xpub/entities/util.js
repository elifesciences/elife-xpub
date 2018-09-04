const lodash = require('lodash')
const knex = require('knex')
const db = require('pubsweet-server/src/db')

const buildQuery = knex({ client: 'pg' })
const runQuery = query => {
  const sql = query.toString()
  return db.query(sql)
}

const keyToCamelCase = snakeKey =>
  snakeKey
    .split(',')
    .map(lodash.camelCase)
    .join('.')

const rowToEntity = row => {
  if (lodash.isArray(row)) {
    return row.map(rowToEntity)
  }

  if (lodash.isPlainObject(row)) {
    return lodash.transform(row, (transformed, val, key) => {
      const camelKey = keyToCamelCase(key)
      lodash.set(transformed, camelKey, rowToEntity(val))
    })
  }

  return row
}

const entityToRow = (entity, columns) =>
  columns.reduce((row, columnName) => {
    const camelKey = keyToCamelCase(columnName)
    const value = lodash.get(entity, camelKey)
    return { ...row, [columnName]: value }
  }, {})

module.exports = { buildQuery, runQuery, rowToEntity, entityToRow }
