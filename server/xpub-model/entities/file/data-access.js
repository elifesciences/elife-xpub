const uuid = require('uuid')
const { rowToEntity, entityToRow, buildQuery, runQuery } = require('../util')

const columnNames = [
  'manuscript_id',
  'filename',
  'label',
  'type',
  'mime_type',
  'size',
  'url',
]

const dataAccess = {
  async selectById(id) {
    const rows = await runQuery(
      buildQuery
        .select()
        .from('file')
        .where({ id }),
    )
    if (!rows.length) {
      throw new Error('File not found')
    }
    return rowToEntity(rows[0])
  },

  async selectAll() {
    const rows = await runQuery(buildQuery.select().from('file'))
    return rows.map(rowToEntity)
  },

  async insert(file) {
    const row = entityToRow(file, columnNames)
    row.id = uuid.v4()
    const query = buildQuery.insert(row).into('file')
    await runQuery(query)
    return row.id
  },

  update(file) {
    const row = entityToRow(file, columnNames)
    const query = buildQuery
      .update(row)
      .table('file')
      .where('id', file.id)
    return runQuery(query)
  },

  delete(id) {
    return runQuery(
      buildQuery
        .delete()
        .from('file')
        .where({ id }),
    )
  },
}
module.exports = dataAccess
