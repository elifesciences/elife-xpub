const Joi = require('joi')

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
      updateSubmission(data: ManuscriptInput!, isAutoSave: Boolean): Manuscript!
      uploadManuscript(id: ID!, file: Upload!): Manuscript!
      finishSubmission(data: ManuscriptInput!): Manuscript!
    }
    
    type Manuscript {
      id: ID
      title: String
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
      manuscriptPersons: [ManuscriptPerson!]!
    }
    
    input ManuscriptInput {
      id: ID!
      title: String
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

    type ManuscriptPerson {
      user: User
      role: ManuscriptRole!
      #Alias has no use once upgraded to a User. Is there any way to move the information from one place to the other?
      alias: UserAlias
      metadata: ManuscriptPersonMetadata
    }
    
    type UserAlias {
      id: ID!
      firstName: String!
      lastName: String!
      publishedName: String
      email: String!
      institution: String!
    }
    
    union ManuscriptPersonMetadata = AuthorMetadata | ReviewerMetadata
    
    type AuthorMetadata {
      rank: Int!
      #contributions: AuthorMetadataContribution!
      corresponding: Boolean!
      conflictOfInterest: String
    }
    
    type ReviewerMetadata {
      rank: Int!
      coRelationship: [ManuscriptPerson]
      #Accounts for instances where a post-doc has helped review
      conflictOfInterest: String
      revealIdentity: Boolean!
    }
    
    
    enum ManuscriptRole {
      DEPUTYEDITOR
      SENIOREDITOR
      REVIEWINGEDITOR
      REVIEWER
      AUTHOR
      SUBMITTER
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
  manuscriptPersons: [],
}

const possibleStages = ['INITIAL', 'QA']
const manuscriptSchema = Joi.object()
  .keys({
    id: Joi.string().required(),
    title: Joi.string().required(),
    manuscriptType: Joi.string().required(),
    subjectAreas: Joi.array()
      .min(1)
      .max(2)
      .required(),
    files: Joi.array().min(1),
    submissionMeta: Joi.object()
      .keys({
        // TODO remove this once we have an ORM
        createdBy: Joi.string(),
        coverLetter: Joi.string().required(),
        author: Joi.object()
          .keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string()
              .email()
              .required(),
            institution: Joi.string().required(),
          })
          .required(),
        hasCorrespondent: Joi.boolean().required(),
        correspondent: Joi.when('hasCorrespondent', {
          is: true,
          then: Joi.object()
            .keys({
              firstName: Joi.string().required(),
              lastName: Joi.string().required(),
              email: Joi.string().required(),
              institution: Joi.string().required(),
            })
            .required(),
        }),
        stage: Joi.string()
          .valid(possibleStages)
          .required(),
        discussedPreviously: Joi.boolean().required(),
        discussion: Joi.when('discussedPreviously', {
          is: true,
          then: Joi.string().required(),
        }),
        consideredPreviously: Joi.boolean().required(),
        previousArticle: Joi.when('consideredPreviously', {
          is: true,
          then: Joi.string().required(),
        }),
        cosubmission: Joi.boolean().required(),
        cosubmissionTitle: Joi.string().allow(''),
        cosubmissionId: Joi.string().allow(''),
      })
      .required(),
    suggestedSeniorEditors: Joi.array()
      .items(Joi.string().required())
      .required(),
    opposedSeniorEditors: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        reason: Joi.string().required(),
      }),
    ),
    suggestedReviewingEditors: Joi.array()
      .items(Joi.string().required())
      .required(),
    opposedReviewingEditors: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        reason: Joi.string().required(),
      }),
    ),
    suggestedReviewers: Joi.array().items(
      Joi.object()
        .keys({
          name: Joi.string().required(),
          email: Joi.string()
            .email()
            .required(),
        })
        .required(),
    ),
    opposedReviewers: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(),
        reason: Joi.string().required(),
      }),
    ),
    noConflictOfInterest: Joi.boolean().required(),
  })
  .required()

const cosubmissionSchema = Joi.alternatives().try(
  Joi.object().keys({
    cosubmission: Joi.boolean().required(),
    cosubmissionTitle: Joi.string().when('cosubmission', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.allow(''),
    }),
    cosubmissionId: Joi.string().allow(''),
  }),
  Joi.object().keys({
    cosubmission: Joi.boolean().required(),
    cosubmissionTitle: Joi.string().allow(''),
    cosubmissionId: Joi.string().when('a', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.string().allow(''),
    }),
  }),
)

module.exports = {
  typeDefs,
  emptyManuscript,
  manuscriptSchema,
  cosubmissionSchema,
}
