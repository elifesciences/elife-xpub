const uuid = require('uuid')
const lodash = require('lodash')
const db = require('pubsweet-server/src/db')

const mapRow = row => {
  if (lodash.isArray(row)) {
    return row.map(mapRow)
  }

  if (lodash.isPlainObject(row)) {
    return lodash.transform(row, (transformed, val, key) => {
      const camelKey = key
        .split('.')
        .map(lodash.camelCase)
        .join('.')
      lodash.set(transformed, camelKey, mapRow(val))
    })
  }

  return row
}

const getValues = (id, manuscript) => [
  id,
  manuscript.journalId,
  manuscript.status,
  manuscript.meta.title,
  manuscript.meta.articleType,
  manuscript.meta.articleIds,
  manuscript.meta.abstract,
  manuscript.meta.subjects,
  manuscript.meta.notes,
  manuscript.previouslyDiscussed,
  manuscript.previouslySubmitted,
  manuscript.cosubmission,
  manuscript.relatedManuscripts,
  manuscript.suggestionsConflict,
  manuscript.coverLetter,
  manuscript.opposedSeniorEditorsReason,
  manuscript.opposedReviewingEditorsReason,
  manuscript.opposedReviewers,
  manuscript.qcIssues,
  manuscript.createdBy,
]

const dataAccess = {
  async selectById(id) {
    const { rows } = await db.query(
      `SELECT m.*,
                COALESCE(jsonb_agg(t.*) FILTER (WHERE t.id IS NOT NULL), '[]') AS teams,
                COALESCE(jsonb_agg(f.*) FILTER (WHERE f.id IS NOT NULL), '[]') AS files
         FROM manuscript m
                LEFT JOIN team t ON m.id = t.object_id
                LEFT JOIN file f ON m.id = f.manuscript_id
         WHERE m.id = $1
         GROUP BY m.id`,
      [id],
    )
    if (!rows.length) {
      throw new Error('Manuscript not found')
    }
    return mapRow(rows[0])
  },

  async selectByStatus(status, user) {
    const { rows } = await db.query(
      `SELECT m.*,
                COALESCE(jsonb_agg(t.*) FILTER (WHERE t.id IS NOT NULL), '[]') AS teams,
                COALESCE(jsonb_agg(f.*) FILTER (WHERE f.id IS NOT NULL), '[]') AS files
         FROM manuscript m
                LEFT JOIN team t ON m.id = t.object_id
                LEFT JOIN file f ON m.id = f.manuscript_id
         WHERE
                m.status = $1 AND
                m.created_by = $2
         GROUP BY m.id`,
      [status, user],
    )
    return rows.map(mapRow)
  },

  async selectAll() {
    const { rows } = await db.query(
      `SELECT m.*, jsonb_agg(t.*) AS teams, jsonb_agg(f.*) AS files
         FROM manuscript m
                LEFT JOIN team t ON m.id = t.object_id
                LEFT JOIN file f ON m.id = f.manuscript_id
         GROUP BY m.id`,
    )
    return rows.map(mapRow)
  },

  async insert(manuscript) {
    const id = uuid.v4()
    const values = getValues(id, manuscript)
    await db.query(
      `INSERT INTO manuscript(id,
                                journal_id,
                                status,
                                "meta.title",
                                "meta.article_type",
                                "meta.article_ids",
                                "meta.abstract",
                                "meta.subjects",
                                "meta.notes",
                                previously_discussed,
                                previously_submitted,
                                cosubmission,
                                related_manuscripts,
                                suggestions_conflict,
                                cover_letter,
                                opposed_senior_editors_reason,
                                opposed_reviewing_editors_reason,
                                opposed_reviewers,
                                qc_issues,
                                created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
      values,
    )
    return id
  },

  update(manuscript) {
    return db.query(
      `UPDATE manuscript
         SET journal_id                       = $2,
             status                           = $3,
             "meta.title"                     = $4,
             "meta.article_type"              = $5,
             "meta.article_ids"               = $6,
             "meta.abstract"                  = $7,
             "meta.subjects"                  = $8,
             "meta.notes"                     = $9,
             previously_discussed             = $10,
             previously_submitted             = $11,
             cosubmission                     = $12,
             related_manuscripts              = $13,
             suggestions_conflict             = $14,
             cover_letter                     = $15,
             opposed_senior_editors_reason    = $16,
             opposed_reviewing_editors_reason = $17,
             opposed_reviewers                = $18,
             qc_issues                        = $19,
             created_by                       = $20
         WHERE id = $1`,
      getValues(manuscript.id, manuscript),
    )
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
