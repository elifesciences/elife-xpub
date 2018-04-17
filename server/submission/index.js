const db = require('../db-helpers/')

module.exports = {
  typeDefs: `
    extend type Query {
      currentSubmission: Manuscript
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
  `,
  resolvers: {
    Query: {
      async currentSubmission(_, vars, ctx) {
        const rows = await db.select({
          'submissionMeta.createdBy': ctx.user,
          'submissionMeta.stage': 'INITIAL',
        })

        return rows[0]
      },
    },
  },
}
