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
      deleteManuscript(id: ID!): ID!
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
      confirmed: Boolean
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
      stage: SubmissionStage
      discussion: String
      previousArticle: String
      cosubmission: [ArticleSearchParams]
    }
    input SubmissionMetaInput {
      coverLetter: String
      author: PersonInput
      discussion: String
      previousArticle: String
      cosubmission: [ArticleSearchParamsInput!]!
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
    type ArticleSearchParams {
      title: String!
      author: String
    }
    input ArticleSearchParamsInput {
      title: String!
      author: String
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
    coverLetter: `
<p><strong>How will your work make others in the field think differently and move the field forward?</strong></p>
<p></p>
<p><strong>How does your work relate to the current literature on the topic?</strong></p>
<p></p>
<p><strong>Who do you consider to be the most relevant audience for this work?</strong></p>
<p></p>
<p><strong>Have you made clear in the letter what the work has and has not achieved?</strong></p>
<p></p>
`,
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
    discussion: null,
    previousArticle: null,
    cosubmission: [],
  },
  manuscriptPersons: [],
}
const MAX_SUGGESTED_REVIEWERS = 6

const suggestedReviewerWithEmail = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
})

const suggestedReviewerWithoutEmail = Joi.object().keys({
  name: Joi.string().allow(['']),
  email: Joi.exist(),
})

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
        discussion: Joi.when('discussedPreviously', {
          is: true,
          then: Joi.string().required(),
        }),
        previousArticle: Joi.when('consideredPreviously', {
          is: true,
          then: Joi.string().required(),
        }),
        cosubmission: Joi.array()
          .items(Joi.object().keys({ title: Joi.string().required() }))
          .required(),
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
    suggestedReviewers: Joi.array()
      .ordered(
        suggestedReviewerWithEmail,
        suggestedReviewerWithEmail,
        suggestedReviewerWithEmail,
      )
      .items(suggestedReviewerWithoutEmail)
      .max(MAX_SUGGESTED_REVIEWERS),
    opposedReviewers: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(),
        reason: Joi.string().required(),
      }),
    ),
    manuscriptPersons: Joi.array(),
    noConflictOfInterest: Joi.boolean().required(),
  })
  .required()

module.exports = {
  typeDefs,
  emptyManuscript,
  manuscriptSchema,
}
