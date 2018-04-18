const db = require('../db-helpers/')
const pool = require('pubsweet-server/src/db')
const uuid = require('uuid')

const typeDefs = `
    extend type Query {
      currentSubmission: Manuscript
    }
    extend type Mutation {
      createSubmission: Manuscript
    }
    type Manuscript {
      id: ID!
      title: String
      source: String
      submissionMeta: SubmissionMeta!
    }
    type SubmissionMeta {
      coverLetter: String
      author: Person!
      correspondent: Person
      stage: SubmissionStage!
    }
    type Person {
      firstName: String
      lastName: String
      email: String
      institution: String
    }
    enum SubmissionStage {
      INITIAL
      QA
    }
`

const resolvers = {
  Query: {
    async currentSubmission(_, vars, ctx) {
      const rows = await db.select({
        'submissionMeta.createdBy': ctx.user,
        'submissionMeta.stage': 'INITIAL',
      })
      return rows[0]
    },
  },
  Mutation: {
    async createSubmission(_, vars, ctx) {
      /**
       * TODO
       * submissionMeta.createdBy
       */
      const id = uuid.v4()
      const emptyManuscript = {
        id: id.toString(),
        title: '',
        source: '',
        submissionMeta: {
          coverLetter: '',
          author: {
            firstName: '',
            lastName: '',
            email: '',
            insitution: '',
          },
          correspondent: {
            firstName: '',
            lastName: '',
            email: '',
            institution: '',
          },
          stage: 'INITIAL',
        },
      }

      /**
       * TODO
       * DB object not identical to schema one
       * this needs to be documented
       */
      const emptyManuscriptDb = Object.assign({}, emptyManuscript)
      emptyManuscriptDb.submissionMeta.createdBy = ctx.user

      /**
       * TODO
       * I'll move this to db-helper for now
       * this needs abstraction layer (e.g. model/fragment)
       */
      await pool.query('INSERT INTO entities (id, data) VALUES ($1, $2)', [
        id,
        { type: 'manuscript', data: emptyManuscriptDb },
      ])
      return emptyManuscript
    },
  },
}

module.exports = { typeDefs, resolvers }
