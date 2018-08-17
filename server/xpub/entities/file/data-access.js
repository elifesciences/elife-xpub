const uuid = require('uuid')
const lodash = require('lodash')
const db = require('pubsweet-server/src/db')

const mapRow = row =>
  lodash.transform(row, (file, val, key) => {
    const camelKey = key
      .split('.')
      .map(lodash.camelCase)
      .join('.')
    lodash.set(file, camelKey, val)
  })

const getValues = (id, file) => [
  id,
  file.manuscriptId,
  file.filename,
  file.label,
  file.type,
  file.mimeType,
  file.size,
  file.url,
]

const dataAccess = {
  async selectById(id) {
    const { rows } = await db.query(
      `SELECT *
         FROM file
         WHERE id = $1`,
      [id],
    )
    if (!rows.length) {
      throw new Error('File not found')
    }
    return mapRow(rows[0])
  },

  async selectAll() {
    const { rows } = await db.query(`SELECT *
                                     FROM file`)
    return rows.map(mapRow)
  },

  async insert(file) {
    const id = uuid.v4()
    await db.query(
      `INSERT INTO file(id, manuscript_id, filename, label, type, mime_type, size, url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      getValues(id, file),
    )
    return id
  },

  update(file) {
    return db.query(
      `UPDATE file
         SET manuscript_id = $2,
             filename      = $3,
             label         = $4,
             type          = $5,
             mime_type     = $6,
             size          = $7,
             url           = $8
         WHERE id = $1`,
      getValues(file.id, file),
    )
  },

  delete(id) {
    return db.query(
      `DELETE
         FROM file
         WHERE id = $1`,
      [id],
    )
  },
}
module.exports = dataAccess
