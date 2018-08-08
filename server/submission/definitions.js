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
      orcidDetails: Person
      manuscript(id: ID!): Manuscript!
      manuscripts: [Manuscript]!
      editors(role: String!): [EditorUser]
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
      suggestedSeniorEditors: [EditorUser]
      opposedSeniorEditors: [EditorUser]
      suggestedReviewingEditors: [EditorUser]
      opposedReviewingEditors: [EditorUser]
      suggestedReviewers: [SuggestedReviewer]
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
      suggestedReviewers: [SuggestedReviewerInput]
      opposedReviewers: [OpposedReviewerInput]
      coverLetter: String
      author: PersonInput
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
    type Person {
      firstName: String
      lastName: String
      email: String
      aff: String
    }
    input PersonInput {
      firstName: String
      lastName: String
      email: String
      aff: String
    }
    enum SubmissionStage {
      INITIAL
      QA
    }

    type EditorUser {
      id: ID
      name: String
      aff: String
      subjectAreas: [String]
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
  meta: {
    title: '',
    articleType: '',
    subjects: [],
  },
  suggestedSeniorEditors: [],
  opposedSeniorEditors: [],
  opposedSeniorEditorsReason: '',
  suggestedReviewingEditors: [],
  opposedReviewingEditors: [],
  opposedReviewingEditorsReason: '',
  suggestedReviewers: [
    { name: '', email: '' },
    { name: '', email: '' },
    { name: '', email: '' },
  ],
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
  author: {
    firstName: '',
    lastName: '',
    email: '',
    aff: '',
  },
  status: 'INITIAL',
  previouslyDiscussed: null,
  previouslySubmitted: [],
  cosubmission: [],
  teams: [],
}
const MAX_SUGGESTED_REVIEWERS = 6
const MIN_SUGGESTED_REVIEWERS = 3

const removeOptionalBlankReviewers = reviewers => {
  const itemIsBlank = item => item.name + item.email === ''

  let numBlanks = 0
  for (
    let index = reviewers.length - 1;
    index >= MIN_SUGGESTED_REVIEWERS;
    index -= 1
  ) {
    const item = reviewers[index]
    if (itemIsBlank(item)) {
      numBlanks += 1
    } else {
      break
    }
  }

  if (numBlanks > 0) {
    reviewers.splice(reviewers.length - numBlanks, numBlanks)
    return reviewers
  }
  return null
}

const suggestedReviewer = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
})

const possibleStatuses = ['INITIAL', 'QA']
const manuscriptSchema = Joi.object()
  .keys({
    id: Joi.string().required(),
    createdBy: Joi.string(),
    files: Joi.array().min(1),
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
    status: Joi.string()
      .valid(possibleStatuses)
      .required(),
    previouslyDiscussed: Joi.string().allow('', null),
    previouslySubmitted: Joi.array().items(Joi.string()),
    cosubmission: Joi.array()
      .items(Joi.string())
      .required(),
    suggestedSeniorEditors: Joi.array()
      .items(Joi.string().required())
      .required(),
    opposedSeniorEditors: Joi.array(),
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
    teams: Joi.array(),
    suggestionsConflict: Joi.boolean().required(),
  })
  .required()

module.exports = {
  typeDefs,
  emptyManuscript,
  manuscriptSchema,
  removeOptionalBlankReviewers,
}
