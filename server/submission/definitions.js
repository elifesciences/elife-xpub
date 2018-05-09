const lodash = require('lodash')
const logger = require('@pubsweet/logger')
const User = require('pubsweet-server/src/models/User')

const db = require('../db-helpers/')
const fetchOrcidDetails = require('../auth/fetchUserDetails')

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
      source: String
      manuscriptType: String
      suggestedSeniorEditors: [String]
      opposedSeniorEditors: [OpposedEditor]
      suggestedReviewingEditors: [String]
      opposedReviewingEditors: [OpposedEditor]
      suggestedReviewers: [SuggestedReviewer]
      opposedReviewers: [OpposedReviewer]
      noConflictOfInterest: Boolean
      submissionMeta: SubmissionMeta
    }
    input ManuscriptInput {
      id: ID!
      title: String
      source: String
      manuscriptType: String
      suggestedSeniorEditors: [String]
      opposedSeniorEditors: [OpposedEditorInput]
      suggestedReviewingEditors: [String]
      opposedReviewingEditors: [OpposedEditorInput]
      suggestedReviewers: [SuggestedReviewerInput]
      opposedReviewers: [OpposedReviewerInput]
      noConflictOfInterest: Boolean
      submissionMeta: SubmissionMetaInput
    }
    type SubmissionMeta {
      coverLetter: String
      author: Person
      hasCorrespondent: Boolean
      correspondent: Person
      stage: SubmissionStage
      discussedPreviously: Boolean
      discussion: String
      consideredPreviously: Boolean
      previousArticle: String
      cosubmission: Boolean
      cosubmissionTitle: String
      cosubmissionId: String
    }
    input SubmissionMetaInput {
      coverLetter: String
      author: PersonInput
      hasCorrespondent: Boolean
      correspondent: PersonInput
      stage: SubmissionStage
      discussedPreviously: Boolean
      discussion: String
      consideredPreviously: Boolean
      previousArticle: String
      cosubmission: Boolean
      cosubmissionTitle: String
      cosubmissionId: String
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
    type OpposedEditor {
      name: String
      reason: String
    }
    input OpposedEditorInput {
      name: String
      reason: String
    }
    type SuggestedReviewer {
      name: String
      email: String
    }
    input SuggestedReviewerInput {
      name: String
      email: String
    }
    type OpposedReviewer {
      name: String
      email: String
      reason: String
    }
    input OpposedReviewerInput {
      name: String
      email: String
      reason: String
    }
`

/**
 * this should be kept in sync with the schema
 */
const emptyManuscript = {
  id: '',
  title: '',
  source: '',
  manuscriptType: '',
  suggestedSeniorEditors: ['', ''],
  opposedSeniorEditors: [],
  suggestedReviewingEditors: ['', ''],
  opposedReviewingEditors: [],
  suggestedReviewers: [
    { name: '', email: '' },
    { name: '', email: '' },
    { name: '', email: '' },
  ],
  opposedReviewers: [],
  noConflictOfInterest: false,
  submissionMeta: {
    coverLetter: '',
    author: {
      firstName: '',
      lastName: '',
      email: '',
      institution: '',
    },
    hasCorrespondent: false,
    correspondent: {
      firstName: '',
      lastName: '',
      email: '',
      institution: '',
    },
    stage: 'INITIAL',
    discussedPreviously: false,
    discussion: '',
    consideredPreviously: false,
    previousArticle: '',
    cosubmission: false,
    cosubmissionTitle: '',
    cosubmissionId: '',
  },
}

const resolvers = {
  Query: {
    async currentSubmission(_, vars, ctx) {
      const rows = await db.select({
        'submissionMeta.createdBy': ctx.user,
        'submissionMeta.stage': 'INITIAL',
      })

      if (!rows.length) {
        return null
      }

      return rows[0]
    },
  },
  Mutation: {
    async createSubmission(_, { data }, ctx) {
      const orcidData = {}
      try {
        const userData = await User.find(ctx.user)
        orcidData.submissionMeta = {
          author: await fetchOrcidDetails(userData),
        }
      } catch (err) {
        logger.error(err)
      }
      const manuscript = lodash.merge(emptyManuscript, orcidData)
      const manuscriptDb = db.manuscriptGqlToDb(manuscript, ctx.user)
      const id = await db.save(manuscriptDb)
      manuscript.id = id
      return manuscript
    },
    async updateSubmission(_, { data }, ctx) {
      const { data: manuscriptDb } = await db.checkPermission(data.id, ctx.user)

      const manuscript = db.manuscriptDbToGql(manuscriptDb, data.id)
      const newManuscript = lodash.merge(manuscript, data)

      const newManuscriptDb = db.manuscriptGqlToDb(newManuscript, ctx.user)
      await db.update(newManuscriptDb, data.id)

      return newManuscript
    },
  },
}

module.exports = { typeDefs, resolvers }
