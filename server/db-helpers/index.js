const uuid = require('uuid')
const Model = require('pubsweet-server/src/models/Model')
const db = require('pubsweet-server/src/db')
const _ = require('lodash')

const remove = async id => {
  await db.query('DELETE FROM entities WHERE id = $1', [id])
}

const selectId = async id => {
  const { rows } = await db.query(
    `SELECT id, data FROM entities WHERE id = $1`,
    [id],
  )
  if (!rows.length) {
    throw new Error('Entity not found')
  }
  return manuscriptDbToGql(rows[0].data, rows[0].id)
}

function manuscriptGqlToDb(manuscript, owner) {
  const manuscriptDb = _.cloneDeep(manuscript)
  delete manuscriptDb.id
  if (owner) {
    manuscriptDb.submissionMeta.createdBy = owner
  }
  manuscriptDb.type = 'manuscript'
  return manuscriptDb
}

function manuscriptDbToGql(manuscriptDb, id) {
  const manuscript = _.cloneDeep(manuscriptDb)
  manuscript.id = id
  delete manuscript.type
  return manuscript
}

const save = async obj => {
  const id = uuid.v4()
  await db.query('INSERT INTO entities (id, data) VALUES ($1, $2)', [id, obj])
  return id
}

const update = async (obj, id) => {
  await db.query('UPDATE entities SET data = $2 WHERE id = $1', [id, obj])
}

const checkPermission = (manuscript, user) => {
  if (user !== manuscript.submissionMeta.createdBy) {
    throw new Error('Manuscript not owned by user')
  }
}

const select = async selector => {
  const where = Model.selectorToSql(selector)

  const { rows } = await db.query(
    `SELECT id, data FROM entities WHERE ${where.join(' AND ')}`,
    Object.values(selector),
  )

  return rows.map(row => manuscriptDbToGql(row.data, row.id))
}

const deleteManuscript = id =>
  db.query('DELETE FROM entities WHERE id = $1', [id])

module.exports = {
  manuscriptGqlToDb,
  manuscriptDbToGql,
  deleteManuscript,
  select,
  save,
  update,
  checkPermission,
  remove,
  selectId,
}
