const uuid = require('uuid')
const Model = require('pubsweet-server/src/models/Model')
const db = require('pubsweet-server/src/db')

const selectAll = async () => {
  const { rows } = await db.query(`SELECT * FROM entities`)
  return rows
}

const remove = async id => {
  await db.query('DELETE FROM entities WHERE id = $1', [id])
}

const selectId = async id => {
  const { rows } = await db.query(
    `SELECT id, data FROM entities WHERE id = $1`,
    [id],
  )
  return rows
}

function manuscriptGqlToDb(manuscript, owner) {
  const manuscriptDb = { ...manuscript }
  delete manuscriptDb.id
  manuscriptDb.submissionMeta.createdBy = owner
  manuscriptDb.type = 'manuscript'
  return manuscriptDb
}

function manuscriptDbToGql(manuscriptDb, id) {
  const manuscript = { ...manuscriptDb }
  manuscript.id = id
  delete manuscript.submissionMeta.createdBy
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

const checkPermission = async (id, user) => {
  const { rows } = await db.query(
    `SELECT id, data FROM entities WHERE id = $1`,
    [id],
  )
  if (!rows.length) {
    throw new Error('Manuscript not found')
  }
  if (user !== rows[0].data.submissionMeta.createdBy) {
    throw new Error('Manuscript not owned by user')
  }
  return rows[0]
}

const select = async selector => {
  const where = Model.selectorToSql(selector)

  const { rows } = await db.query(
    `SELECT id, data FROM entities WHERE ${where.join(' AND ')}`,
    Object.values(selector),
  )

  return rows.map(row => manuscriptDbToGql(row.data, row.id))
}

const getOrcidData = async user =>
  /* TODO get orcid data for user (orcid user id)
  /*
  /* const { rows } = await dbx.query( */
  /*   `SELECT id, data FROM entities WHERE id = $1`, */
  /*   [ctx.user], */
  /* ) */
  ({
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email@mailinator.com',
    institution: 'institution',
  })

module.exports = {
  manuscriptGqlToDb,
  manuscriptDbToGql,
  select,
  save,
  update,
  checkPermission,
  getOrcidData,
  remove,
  selectAll,
  selectId,
}
