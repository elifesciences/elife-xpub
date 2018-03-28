const Joi = require('joi')

module.exports = {
  user: {
    email: Joi.string().email(),
    passwordHash: Joi.string(),
    orcid: Joi.string().required(),
    oauth: Joi.object({
      accessToken: Joi.string(),
      refreshToken: Joi.string(),
    }),
  },
}
