const lodash = require('lodash')

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

const entityToRow = (manuscript, columns) =>
  columns.reduce((entity, columnName) => {
    const camelKey = keyToCamelCase(columnName)
    const value = lodash.get(manuscript, camelKey)
    return { ...entity, [columnName]: value }
  }, {})

module.exports = { rowToEntity, entityToRow }
