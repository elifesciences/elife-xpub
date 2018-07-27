const yup = require('yup')

class SuggestedReviewersValidator {
  constructor() {
    this.schema1 = yup.object({
      name: yup.string().required(),
      email: yup
        .string()
        .email('Must be a valid email')
        .required('Email is required'),
    })
    this.schema2 = yup.object({
      name: yup.string(),
      email: yup.string(),
    })
    this.MAX_REQUIRED_WITH_EMAIL = 3
  }

  validate(reviewers) {
    for (let index = 0; index < reviewers.length; index += 1) {
      const element = reviewers[index]

      if (index < this.MAX_REQUIRED_WITH_EMAIL) {
        this.schema1.validateSync(element)
      } else {
        this.schema2.validateSync(element)
      }
    }
    return true
  }

  static validReviewers(msg) {
    return this.test({
      name: 'validReviewers',
      exclusive: false,
      message: msg || 'Must be a valid Reviewers array',
      params: {},
      test: value => {
        const validator = new SuggestedReviewersValidator()
        return validator.validate(value)
      },
    })
  }

  static init() {}
}

const addValidReviewers = () => {
  yup.addMethod(
    yup.array,
    'validReviewers',
    SuggestedReviewersValidator.validReviewers,
  )
}

addValidReviewers()
