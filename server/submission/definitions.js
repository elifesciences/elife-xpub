const db = require('../db-helpers/')

/**
 * TODO
 * better way to have Manuscript as input type
 * instead of duplicating each type
 *
 * do we need ID in Manuscript?
 */
const typeDefs = `
    extend type Query {
      currentSubmission: Manuscript
    }
    extend type Mutation {
      createSubmission: Manuscript!
      updateSubmission(data: ManuscriptInput!): Manuscript!
    }
    type Manuscript {
      id: ID!
      title: String
      source: String
      submissionMeta: SubmissionMeta!
    }
    input ManuscriptInput {
      id: ID!
      title: String!
      source: String!
      submissionMeta: SubmissionMetaInput!
    }
    type SubmissionMeta {
      coverLetter: String
      author: Person!
      correspondent: Person
      stage: SubmissionStage!
    }
    input SubmissionMetaInput {
      coverLetter: String!
      author: PersonInput!
      correspondent: PersonInput!
      stage: SubmissionStage!
    }
    type Person {
      firstName: String
      lastName: String
      email: String
      institution: String
    }
    input PersonInput {
      firstName: String!
      lastName: String!
      email: String!
      institution: String!
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
      const manuscriptDb = Object.assign({}, emptyManuscript)
      manuscriptDb.submissionMeta.createdBy = ctx.user
      delete manuscriptDb.id

      const id = await db.save('manuscript', manuscriptDb)
      emptyManuscript.id = id
      return emptyManuscript
    },
    async updateSubmission(_, vars, ctx) {
      /**
       * TODO
       * check that manuscript with vars.data.id is actually
       * owned by ctx.user
       *
       * we can get manuscript after id, then check with createdBy
       * or just get current manuscript for ctx.user and save there
       *
       * for now this works
       * multiple ways to get the current manuscript
       * error here might not be ok
       */
      const rows = await db.select({
        'submissionMeta.createdBy': ctx.user,
        'submissionMeta.stage': 'INITIAL',
      })

      // build manuscript db object
      const manuscriptDb = Object.assign({}, vars.data)
      manuscriptDb.submissionMeta.createdBy = ctx.user
      delete manuscriptDb.id

      await db.update(rows[0].id, rows[0].data.type, manuscriptDb)
      return vars.data
    },
  },
}

module.exports = { typeDefs, resolvers }
