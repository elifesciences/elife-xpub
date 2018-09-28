const uuid = require('uuid')
const { rowToEntity, entityToRow, buildQuery, runQuery } = require('../util')

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
  'opposed_reviewers_reason',
  'submitter_signature',
  'disclosure_consent',
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
  async selectById(id, user) {
    const query = joinSelect
      .clone()
      .where({ 'manuscript.id': id, 'manuscript.created_by': user })
    const rows = await runQuery(query)

    if (!rows.length) {
      throw new Error('Manuscript not found')
    }
    return rowToEntity(rows[0])
  },

  async selectByStatus(status, user) {
    const query = joinSelect
      .clone()
      .where({ 'manuscript.status': status, 'manuscript.created_by': user })
    const rows = await runQuery(query)
    return rows.map(rowToEntity)
  },

  async selectAll(user) {
    const query = joinSelect.clone().where({ 'manuscript.created_by': user })
    const rows = await runQuery(query)
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
    const query = buildQuery
      .update(row)
      .table('manuscript')
      .where('id', manuscript.id)

    return runQuery(query)
  },

  delete(id) {
    const query = buildQuery
      .delete()
      .from('manuscript')
      .where({ id })
    return runQuery(query)
  },
}

module.exports = dataAccess
