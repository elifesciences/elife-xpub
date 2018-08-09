const Joi = require('joi')
const fs = require('fs')

const xpubSchema = fs.readFileSync(`${__dirname}/xpub.graphqls`)
const elifeSchema = fs.readFileSync(`${__dirname}/elife.graphqls`)

/**
 * types & input types should be kept in sync
 */
const typeDefs = `
    ${xpubSchema}
    ${elifeSchema}

    extend type Query {
      currentSubmission: Manuscript
      orcidDetails: AuthorAlias
      manuscript(id: ID!): Manuscript!
      manuscripts: [Manuscript]!
      editors(role: String!): [EditorAlias]
    }

    extend type Mutation {
      createSubmission: Manuscript!
      deleteManuscript(id: ID!): ID!
      updateSubmission(data: ManuscriptInput!, isAutoSave: Boolean): Manuscript!
      uploadManuscript(id: ID!, file: Upload!): Manuscript!
      finishSubmission(data: ManuscriptInput!): Manuscript!
    }

    extend type Manuscript {
      # todo: these should be handled through teams
      opposedReviewers: [OpposedReviewer]
      author: Alias

      # todo: these should be handled through notes
      opposedSeniorEditorsReason: String
      opposedReviewingEditorsReason: String
      coverLetter: String
    }

    input ManuscriptInput {
      id: ID!
      suggestedSeniorEditors: [ID]
      opposedSeniorEditors: [ID]
      opposedSeniorEditorsReason: String
      suggestedReviewingEditors: [ID]
      opposedReviewingEditors: [ID]
      opposedReviewingEditorsReason: String
      suggestedReviewers: [ReviewerAliasInput]
      opposedReviewers: [OpposedReviewerInput]
      coverLetter: String
      author: AuthorAliasInput
      previouslyDiscussed: String
      previouslySubmitted: [String]
      cosubmission: [String!]!
      suggestionsConflict: Boolean
      meta: ManuscriptMetaInput
    }

    input ManuscriptMetaInput {
      title: String
      articleType: String
      subjects: [String]
    }
    enum SubmissionStage {
      INITIAL
      QA
    }

    # temporary solution awaiting more clarity on team member metadata in shared data model
    union Assignee = EditorAlias | ReviewerAlias | AuthorAlias
    type AuthorAlias {
      firstName: String
      lastName: String
      email: String
      aff: String
    }
    input AuthorAliasInput {
      firstName: String
      lastName: String
      email: String
      aff: String
    }
    type EditorAlias {
      id: ID
      name: String
      aff: String
      subjectAreas: [String]
    }
    type ReviewerAlias {
      name: String
      email: String
    }
    input ReviewerAliasInput {
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
  meta: {
    title: '',
    articleType: '',
    subjects: [],
  },
  opposedSeniorEditorsReason: '',
  opposedReviewingEditorsReason: '',
  opposedReviewers: [],
  suggestionsConflict: false,
  files: [],
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
  status: 'INITIAL',
  previouslyDiscussed: null,
  previouslySubmitted: [],
  cosubmission: [],
  teams: [
    {
      role: 'suggestedReviewer',
      teamMembers: [
        { meta: { name: '', email: '' } },
        { meta: { name: '', email: '' } },
        { meta: { name: '', email: '' } },
      ],
    },
  ],
}
const MAX_SUGGESTED_REVIEWERS = 6
const MIN_SUGGESTED_REVIEWERS = 3

const removeOptionalBlankReviewers = reviewers => {
  const itemIsBlank = item => item.name + item.email === ''

  return reviewers.filter(
    (item, index) => index < MIN_SUGGESTED_REVIEWERS || !itemIsBlank(item),
  )
}

const suggestedReviewer = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
})

const manuscriptSchema = Joi.object()
  .keys({
    id: Joi.string().required(),
    meta: Joi.object()
      .keys({
        title: Joi.string().required(),
        articleType: Joi.string().required(),
        subjects: Joi.array()
          .min(1)
          .max(2)
          .required(),
      })
      .required(),
    coverLetter: Joi.string().required(),
    author: Joi.object()
      .keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(),
        aff: Joi.string().required(),
      })
      .required(),
    previouslyDiscussed: Joi.string().allow('', null),
    previouslySubmitted: Joi.array().items(Joi.string()),
    cosubmission: Joi.array()
      .items(Joi.string())
      .required(),
    suggestedSeniorEditors: Joi.array()
      .items(Joi.string().required())
      .required(),
    opposedSeniorEditors: Joi.array()
      .items(Joi.string())
      .required(),
    opposedSeniorEditorsReason: Joi.string().when('opposedSeniorEditors', {
      is: Joi.array().min(1),
      then: Joi.string().required(),
      otherwise: Joi.string().allow(''),
    }),
    suggestedReviewingEditors: Joi.array()
      .items(Joi.string().required())
      .required(),
    opposedReviewingEditors: Joi.array()
      .items(Joi.string())
      .required(),
    opposedReviewingEditorsReason: Joi.string().when(
      'opposedReviewingEditors',
      {
        is: Joi.array().min(1),
        then: Joi.string().required(),
        otherwise: Joi.string().allow(''),
      },
    ),
    suggestedReviewers: Joi.array()
      .items(suggestedReviewer)
      .min(MIN_SUGGESTED_REVIEWERS)
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
    suggestionsConflict: Joi.boolean().required(),
  })
  .required()

module.exports = {
  typeDefs,
  emptyManuscript,
  manuscriptSchema,
  removeOptionalBlankReviewers,
}
