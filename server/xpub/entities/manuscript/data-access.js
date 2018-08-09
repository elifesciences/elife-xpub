const uuid = require('uuid')
const db = require('pubsweet-server/src/db')

const mapRow = row => ({ ...row.data, id: row.id, type: undefined })

const dataAccess = {
  async selectById(id) {
    const { rows } = await db.query(
      `SELECT id, data FROM entities WHERE id = $1`,
      [id],
    )
    if (!rows.length) {
      throw new Error('Manuscript not found')
    }
    return mapRow(rows[0])
  },

  async selectByStatus(status, user) {
    const { rows } = await db.query(
      `SELECT id, data FROM entities WHERE data->>'status' = $1 AND data->>'createdBy' = $2`,
      [status, user],
    )
    return rows.map(mapRow)
  },

  async selectAll() {
    const { rows } = await db.query(
      `SELECT id, data FROM entities WHERE data->>'type' = 'manuscript'`,
    )
    return rows.map(mapRow)
  },

  async insert(manuscript) {
    const id = uuid.v4()
    await db.query('INSERT INTO entities (id, data) VALUES ($1, $2)', [
      id,
      { ...manuscript, type: 'manuscript' },
    ])
    return id
  },

  update(manuscript) {
    return db.query('UPDATE entities SET data = $2 WHERE id = $1', [
      manuscript.id,
      { ...manuscript, type: 'manuscript' },
    ])
  },

  delete(id) {
    return db.query(
      `DELETE FROM entities WHERE id = $1 AND data->>'type' = 'manuscript'`,
      [id],
    )
  },
}
module.exports = dataAccess
