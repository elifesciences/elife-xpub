const uuid = require('uuid')

const Model = require('pubsweet-server/src/models/Model')
// const NotFoundError = require('pubsweet-server/src/errors/NotFoundError')
const db = require('pubsweet-server/src/db')

/* function manuscriptToDb(graphqlObj, ctx) { */
/*   /\** */
/*    * TODO */
/*    * graphql schema is not identical to the db schema */
/*    * this needs to be documented */
/*    * */
/*    * function that converts a manuscript from graphql format to db format */
/*    * this function assumes graphqlObj has all the fields */
/*    *\/ */
/*   const dbObj = { ...graphqlObj } */
/*   dbObj.submissionMeta.createdBy = ctx.user */
/*   dbObj.type = 'manuscript' */
/*   delete dbObj.id */
/*   return dbObj */
/* } */

/* function manuscriptToGraphql(dbObj, id) { */
/*   /\* TODO *\/ */
/*   const manuscript = { ...dbObj } */
/*   delete manuscript.createdBy */
/*   delete manuscript.type */
/*   manuscript.id = id */
/*   return manuscript */
/* } */

const select = async selector => {
  const where = Model.selectorToSql(selector)

  const { rows } = await db.query(
    `SELECT id, data FROM entities WHERE ${where.join(' AND ')}`,
    Object.values(selector),
  )

  /* if (!rows.length) { */
  /*     return {}; */
  /* } */

  return rows
  // return manuscriptToGraphql(rows[0].data, rows[0].id)
}

const save = async (manuscript, ctx) => {
  /**
   * TODO jsdoc args + returns
   * this returns the id of the stored element
   */
  const id = uuid.v4()
  // const manuscriptDb = manuscriptToDb(manuscript, ctx)
  const manuscriptDb = manuscript
  await db.query('INSERT INTO entities (id, data) VALUES ($1, $2)', [
    id,
    { ...manuscriptDb },
  ])
  return id
}

const update = async (id, manuscript, ctx) => {
  /**
   * TODO jsdoc args + returns
   * this should be moved to save()
   * sanity checks for args
   * error thrown on query fail?
   * return something here?
   */
  // const manuscriptDb = manuscriptToDb(manuscript, ctx)
  const manuscriptDb = manuscript
  await db.query('UPDATE entities SET data = $2 WHERE id = $1', [
    id,
    { ...manuscriptDb },
  ])
}

module.exports = { select, save, update }
