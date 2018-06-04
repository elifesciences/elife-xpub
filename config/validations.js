const Joi = require('joi')

module.exports = {
  fragment: [
    {
      fragmentType: Joi.valid('manuscript').required(),
      title: Joi.string().required(),
      source: Joi.string(),
      metadata: Joi.any(),
    },
  ],
  user: {
    // make these core fields optional
    email: Joi.string().email(),
    passwordHash: Joi.string(),

    // auth fields
    orcid: Joi.string(),
    oauth: Joi.object({
      accessToken: Joi.string(),
      refreshToken: Joi.string(),
    }),
  },
}
