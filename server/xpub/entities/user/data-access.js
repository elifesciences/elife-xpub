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
      throw new Error('User not found')
    }
    return mapRow(rows[0])
  },

  async selectAll() {
    const { rows } = await db.query(
      `SELECT id, data FROM entities WHERE data->>'type' = 'user'`,
    )
    return rows.map(mapRow)
  },

  async insert(user) {
    const id = uuid.v4()
    await db.query('INSERT INTO entities (id, data) VALUES ($1, $2)', [
      id,
      { ...user, type: 'user' },
    ])
    return id
  },

  update(user) {
    return db.query('UPDATE entities SET data = $2 WHERE id = $1', [
      user.id,
      { ...user, type: 'user' },
    ])
  },

  delete(id) {
    return db.query(
      `DELETE FROM entities WHERE id = $1 AND data->>'type' = 'user'`,
      [id],
    )
  },
}

module.exports = dataAccess
