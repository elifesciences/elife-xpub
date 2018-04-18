const db = require('../db-helpers/')

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
      const emptyManuscript = {
        id: '',
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
       *
       * also, for now id not needed in db object (data)
       * so no need to store it twice
       */
      const emptyManuscriptDb = Object.assign({}, emptyManuscript)
      emptyManuscriptDb.submissionMeta.createdBy = ctx.user
      delete emptyManuscriptDb.id

      const id = await db.save('manuscript', emptyManuscriptDb)
      emptyManuscript.id = id
      return emptyManuscript
    },
  },
}

module.exports = { typeDefs, resolvers }
