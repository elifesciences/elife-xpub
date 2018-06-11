/**
 * types & input types should be kept in sync
 */
const typeDefs = `
    extend type Query {
      currentSubmission: Manuscript
      orcidDetails: Person
      manuscript(id: ID!): Manuscript!
      manuscripts: [Manuscript]!
    }
    extend type Mutation {
      createSubmission: Manuscript!
      updateSubmission(data: ManuscriptInput!): Manuscript!
      uploadManuscript(id: ID!, file: Upload!): Manuscript!
    }
    
    type Manuscript {
      id: ID
      title: String
      source: String
      manuscriptType: String
      subjectAreas: [String]
      suggestedSeniorEditors: [String]
      opposedSeniorEditors: [OpposedEditor]
      suggestedReviewingEditors: [String]
      opposedReviewingEditors: [OpposedEditor]
      suggestedReviewers: [SuggestedReviewer]
      opposedReviewers: [OpposedReviewer]
      noConflictOfInterest: Boolean
      files: [File]
      submissionMeta: SubmissionMeta
    }
    input ManuscriptInput {
      id: ID!
      title: String
      source: String
      manuscriptType: String
      subjectAreas: [String]
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
    type File {
      name: String
      url: String
      size: String
      type: String
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
  subjectAreas: [],
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
  files: [],
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

module.exports = { typeDefs, emptyManuscript }
