const uuid = require('uuid')
const { rowToEntity, entityToRow, buildQuery, runQuery } = require('../../util')

const columnNames = ['team_members', 'role', 'object_id', 'object_type']

const dataAccess = {
  async selectById(id) {
    const { rows } = await runQuery(
      buildQuery
        .select()
        .from('team')
        .where({ id }),
    )
    if (!rows.length) {
      throw new Error('Team not found')
    }
    return rowToEntity(rows[0])
  },

  async selectAll() {
    const { rows } = await runQuery(buildQuery.select().from('team'))
    return rows.map(rowToEntity)
  },

  async insert(team) {
    const row = entityToRow(team, columnNames)
    row.id = uuid.v4()
    const query = buildQuery.insert(row).into('team')
    await runQuery(query)
    return row.id
  },

  update(team) {
    const row = entityToRow(team, columnNames)
    const query = buildQuery
      .update(row)
      .table('team')
      .where('id', team.id)
    return runQuery(query)
  },

  delete(id) {
    return runQuery(
      buildQuery
        .delete()
        .from('team')
        .where({ id }),
    )
  },
}

module.exports = dataAccess
