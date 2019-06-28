const Joi = require('joi')

const MIN_SUGGESTED_SENIOR_EDITORS = 2
const MAX_SUGGESTED_SENIOR_EDITORS = 6
const MIN_SUGGESTED_REVIEWING_EDITORS = 2
const MAX_SUGGESTED_REVIEWING_EDITORS = 6
const MAX_SUGGESTED_REVIEWERS = 6

const manuscriptInputSchema = Joi.object()
  .keys({
    id: Joi.string().required(),
    meta: Joi.object()
      .keys({
        title: Joi.string().required(),
        articleType: Joi.string().required(),
        subjects: Joi.alternatives().when('articleType', {
          is: 'feature',
          then: Joi.array().max(2),
          otherwise: Joi.array()
            .min(1)
            .max(2)
            .required(),
        }),
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
      .min(MIN_SUGGESTED_SENIOR_EDITORS)
      .max(MAX_SUGGESTED_SENIOR_EDITORS)
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
      .min(MIN_SUGGESTED_REVIEWING_EDITORS)
      .max(MAX_SUGGESTED_REVIEWING_EDITORS)
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
      .items(
        Joi.object().keys({
          name: Joi.string().required(),
          email: Joi.string()
            .email()
            .required(),
        }),
      )
      .max(MAX_SUGGESTED_REVIEWERS),
    opposedReviewers: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(),
      }),
    ),
    opposedReviewersReason: Joi.string().when('opposedReviewers', {
      is: Joi.array().min(1),
      then: Joi.string().required(),
      otherwise: Joi.string().allow(''),
    }),
    submitterSignature: Joi.string().required(),
    disclosureConsent: Joi.bool().required(),
  })
  .required()

module.exports = manuscriptInputSchema
