const lodash = require('lodash')

const db = require('../db-helpers/')

/**
 * types & input types should be kept in sync
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
      id: ID
      title: String
      type: ManuscriptType
      source: String
      submissionMeta: SubmissionMeta
    }
    input ManuscriptInput {
      id: ID!
      title: String
      source: String
      submissionMeta: SubmissionMetaInput
    }
    type SubmissionMeta {
      coverLetter: String
      author: Person
      correspondent: Person
      createdBy: String
      stage: SubmissionStage
    }
    input SubmissionMetaInput {
      coverLetter: String
      author: PersonInput!
      correspondent: PersonInput
      stage: SubmissionStage!
    }
    type Person {
      firstName: String
      lastName: String
      email: String
      institution: String
    }
    input PersonInput {
      firstName: String
      lastName: String
      email: String
      institution: String
    }
    enum SubmissionStage {
      INITIAL
      QA
    }
    enum ManuscriptType {
      manuscript
    }
`

/**
 * this should be kept in sync with the schema
 */
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
      institution: '',
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

const resolvers = {
  Query: {
    async currentSubmission(_, vars, ctx) {
      // TODO this will throw an error when you click on submit intially
      const rows = await db.select({
        'submissionMeta.createdBy': ctx.user,
        'submissionMeta.stage': 'INITIAL',
      })

      if (!rows.length) {
        return null
      }

      const manuscript = rows[0].data
      manuscript.id = rows[0].id
      return manuscript
    },
  },
  Mutation: {
    async createSubmission(_, vars, ctx) {
      // TODO get actual data from orcid
      // const orcidData = db.getOrcidData(ctx.user);
      const orcidData = {
        submissionMeta: {
          author: {
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email',
            institution: 'institution',
          },
        },
      }
      const manuscript = lodash.merge(emptyManuscript, orcidData)
      const manuscriptDb = db.manuscriptToDb(manuscript, ctx.user)
      const id = await db.save(manuscriptDb)
      manuscript.id = id
      return manuscript
    },
    async updateSubmission(_, vars, ctx) {
      // check permission
      const { data: oldManDb } = await db.checkPermission(
        vars.data.id,
        ctx.user,
      )

      // compute new manuscript by applying vars.data to old manuscript
      const oldMan = db.manuscriptToGraphql(oldManDb, vars.data.id)
      const newMan = lodash.merge(oldMan, vars.data)

      // update old one
      const newManDb = db.manuscriptToDb(newMan, ctx.user)
      await db.update(newManDb, vars.data.id)

      // return updated manuscript to user
      return newMan
    },
  },
}

module.exports = { typeDefs, resolvers }
