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
      initial
      qa
    }
  `,
  resolvers: {
    Query: {
      currentSubmission(_, vars, ctx) {
        console.log('>>>>> server/submission/index.js:31\n', 'ctx:', ctx)
        return null
      },
    },
  },
}
