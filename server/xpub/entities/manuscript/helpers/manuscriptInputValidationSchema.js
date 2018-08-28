const Joi = require('joi')

const MAX_SUGGESTED_REVIEWERS = 6
const MIN_SUGGESTED_REVIEWERS = 3

const manuscriptInputSchema = Joi.object()
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
      .items(
        Joi.object().keys({
          name: Joi.string().required(),
          email: Joi.string()
            .email()
            .required(),
        }),
      )
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
    submitterSignature: Joi.string().required(),
    disclosureConsent: Joi.bool().required(),
  })
  .required()

module.exports = manuscriptInputSchema
