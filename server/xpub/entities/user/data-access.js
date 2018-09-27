const uuid = require('uuid')
const { rowToEntity, entityToRow, buildQuery, runQuery } = require('../util')

const columnNames = ['default_identity']

const joinQuery = buildQuery
  .select(
    'user.*',
    buildQuery.raw(
      "COALESCE(jsonb_agg(DISTINCT identity.*) FILTER (WHERE identity.id IS NOT NULL), '[]') AS identities",
    ),
  )
  .from('user')
  .join('identity', 'user.id', 'identity.user_id')
  .groupBy('user.id')

const dataAccess = {
  async selectById(id) {
    const { rows } = await runQuery(joinQuery.clone().where('user.id', id))
    if (!rows.length) {
      throw new Error('User not found')
    }
    return rowToEntity(rows[0])
  },

  async selectByProfileId(profileId) {
    const { rows } = await runQuery(
      joinQuery.clone().where('identity.identifier', profileId),
    )
    if (!rows.length) {
      throw new Error('User not found')
    }
    return rowToEntity(rows[0])
  },

  async selectAll() {
    const { rows } = await runQuery(joinQuery)
    return rows.map(rowToEntity)
  },

  async insert(user) {
    const row = entityToRow(user, columnNames)
    row.id = uuid.v4()
    const query = buildQuery.insert(row).into('user')
    await runQuery(query)
    return row.id
  },

  update(user) {
    const row = entityToRow(user, columnNames)
    const query = buildQuery
      .update(row)
      .table('user')
      .where('id', user.id)
    return runQuery(query)
  },

  delete(id) {
    return runQuery(
      buildQuery
        .delete()
        .from('user')
        .where({ id }),
    )
  },
}
module.exports = dataAccess
