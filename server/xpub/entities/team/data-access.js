const uuid = require('uuid')
const lodash = require('lodash')
const db = require('pubsweet-server/src/db')

const mapRow = row =>
  lodash.transform(row, (team, val, key) => {
    const camelKey = key
      .split('.')
      .map(lodash.camelCase)
      .join('.')
    lodash.set(team, camelKey, val)
  })

const getValues = (id, team) => [
  id,
  team.teamMembers,
  team.role,
  team.objectId,
  team.objectType,
]

const dataAccess = {
  async selectById(id) {
    const { rows } = await db.query(`SELECT * FROM team WHERE id = $1`, [id])
    if (!rows.length) {
      throw new Error('Team not found')
    }
    return mapRow(rows[0])
  },

  async selectAll() {
    const { rows } = await db.query(`SELECT * FROM team`)
    return rows.map(mapRow)
  },

  async insert(team) {
    const id = uuid.v4()
    await db.query(
      `INSERT INTO team (
        id, 
        team_members, 
        role, 
        object_id, 
        object_type
      ) VALUES ($1, $2, $3, $4, $5)`,
      getValues(id, team),
    )
    return id
  },

  update(team) {
    return db.query(
      `UPDATE team SET
        team_members = $2,
        role = $3,
        object_id = $4,
        object_type = $5
      WHERE id = $1`,
      getValues(team.id, team),
    )
  },

  delete(id) {
    return db.query(`DELETE FROM team WHERE id = $1`, [id])
  },
}
module.exports = dataAccess
