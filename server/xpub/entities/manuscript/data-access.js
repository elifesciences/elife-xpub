const uuid = require('uuid')
const knex = require('knex')
const db = require('pubsweet-server/src/db')
const { rowToEntity, entityToRow } = require('../../util')

const buildQuery = knex({ client: 'pg' })
const runQuery = query => {
  const sql = query.toString()
  return db.query(sql)
}

const columnNames = [
  'journal_id',
  'status',
  'meta,title',
  'meta,article_type',
  'meta,article_ids',
  'meta,abstract',
  'meta,subjects',
  'meta,notes',
  'previously_discussed',
  'previously_submitted',
  'cosubmission',
  'related_manuscripts',
  'suggestions_conflict',
  'cover_letter',
  'opposed_senior_editors_reason',
  'opposed_reviewing_editors_reason',
  'opposed_reviewers',
  'qc_issues',
  'created_by',
]

const joinSelect = buildQuery
  .select(
    'manuscript.*',
    buildQuery.raw(
      "COALESCE(jsonb_agg(DISTINCT team.*) FILTER (WHERE team.id IS NOT NULL), '[]') AS teams",
    ),
    buildQuery.raw(
      "COALESCE(jsonb_agg(DISTINCT file.*) FILTER (WHERE file.id IS NOT NULL), '[]') AS files",
    ),
  )
  .from('manuscript')
  .leftJoin('team', 'manuscript.id', 'team.object_id')
  .leftJoin('file', 'manuscript.id', 'file.manuscript_id')
  .groupBy('manuscript.id')

const dataAccess = {
  async selectById(id) {
    const query = joinSelect.clone().where({ 'manuscript.id': id })
    const { rows } = await runQuery(query)

    if (!rows.length) {
      throw new Error('Manuscript not found')
    }
    return rowToEntity(rows[0])
  },

  async selectByStatus(status, user) {
    const query = joinSelect
      .clone()
      .where({ 'manuscript.status': status, 'manuscript.created_by': user })
    const { rows } = await runQuery(query)
    return rows.map(rowToEntity)
  },

  async selectAll() {
    const { rows } = await runQuery(joinSelect)
    return rows.map(rowToEntity)
  },

  async insert(manuscript) {
    const row = entityToRow(manuscript, columnNames)
    row.id = uuid.v4()
    const query = buildQuery.insert(row).into('manuscript')

    await runQuery(query)
    return row.id
  },

  update(manuscript) {
    const row = entityToRow(manuscript, columnNames)
    const query = buildQuery('manuscript')
      .update(row)
      .where('id', manuscript.id)

    return runQuery(query)
  },

  delete(id) {
    return db.query(
      `DELETE
         FROM manuscript
         WHERE id = $1`,
      [id],
    )
  },
}
module.exports = dataAccess
