const uuid = require('uuid')
const { rowToEntity, entityToRow, buildQuery, runQuery } = require('../util')

const columnNames = ['user_id', 'type', 'identifier']

const dataAccess = {
  async selectById(id) {
    const { rows } = await runQuery(
      buildQuery
        .select()
        .from('identity')
        .where({ id }),
    )
    if (!rows.length) {
      throw new Error('Identity not found')
    }
    return rowToEntity(rows[0])
  },

  async selectAll() {
    const { rows } = await runQuery(buildQuery.select().from('identity'))
    return rows.map(rowToEntity)
  },

  async insert(identity) {
    const row = entityToRow(identity, columnNames)
    row.id = uuid.v4()
    const query = buildQuery.insert(row).into('identity')
    await runQuery(query)
    return row.id
  },

  update(identity) {
    const row = entityToRow(identity, columnNames)
    const query = buildQuery
      .update(row)
      .table('identity')
      .where('id', identity.id)
    return runQuery(query)
  },

  delete(id) {
    return runQuery(
      buildQuery
        .delete()
        .from('identity')
        .where({ id }),
    )
  },
}
module.exports = dataAccess
