const uuid = require('uuid')
const Model = require('pubsweet-server/src/models/Model')
const db = require('pubsweet-server/src/db')

/**
 * TODO
 * functions here should have sanity checks in the future
 */

function manuscriptGqlToDb(manuscript, owner) {
  /**
   * converts manuscript from graphql schema to db schema
   * for now this is the only place where the db schema for
   * a manuscript is documented
   */
  const manuscriptDb = { ...manuscript }
  delete manuscriptDb.id
  manuscriptDb.submissionMeta.createdBy = owner
  manuscriptDb.type = 'manuscript'
  return manuscriptDb
}

function manuscriptDbToGql(manuscriptDb, id) {
  /**
   * converts manuscript from db schema to graphql schema
   */
  const manuscript = { ...manuscriptDb }
  manuscript.id = id
  delete manuscript.submissionMeta.createdBy
  delete manuscript.type
  return manuscript
}

const save = async obj => {
  /**
   * saves generic object to db
   */
  const id = uuid.v4()
  await db.query('INSERT INTO entities (id, data) VALUES ($1, $2)', [id, obj])
  return id
}

const update = async (obj, id) => {
  /**
   * updates generic object in db
   * this should be moved to save in the future
   */
  await db.query('UPDATE entities SET data = $2 WHERE id = $1', [id, obj])
}

const checkPermission = async (id, user) => {
  /**
   * checks if manuscript is owned by user and returns old data
   * in db format (id, data)
   *
   * manuscript owner should be stored at top level in the future
   * or be in sync with other models
   */
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

  return rows
}

const getOrcidData = async user =>
  /**
   * TODO
   * get orcid data for user (orcid user id)
   *
   * @returns {object} - orcid data
   *   {submissionMeta: {author: {firstName: "", lastName: "",
   *      email: "", institution: ""}}}
   */

  /* const { rows } = await dbx.query( */
  /*   `SELECT id, data FROM entities WHERE id = $1`, */
  /*   [ctx.user], */
  /* ) */

  ({})

module.exports = {
  manuscriptGqlToDb,
  manuscriptDbToGql,
  select,
  save,
  update,
  checkPermission,
  getOrcidData,
}
