const Joi = require('joi')

module.exports = {
  user: {
    // make these core fields optional
    email: Joi.string().email(),
    passwordHash: Joi.string(),

    // auth fields
    orcid: Joi.string().required(),
    oauth: Joi.object({
      accessToken: Joi.string(),
      refreshToken: Joi.string(),
    }),
  },
}
