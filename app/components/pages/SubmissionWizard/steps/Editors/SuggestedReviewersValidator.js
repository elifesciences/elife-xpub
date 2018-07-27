import yup, { ValidationError } from 'yup'
import { cloneDeep } from 'lodash'

class SuggestedReviewersValidator {
  constructor() {
    this.schema1 = yup.object({
      name: yup.string().required('Name is required'),
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

  validate(reviewers, parentYup) {
    const errors = []
    const opts = { abortEarly: false }

    for (let index = 0; index < reviewers.length; index += 1) {
      const element = reviewers[index]
      try {
        if (index < this.MAX_REQUIRED_WITH_EMAIL) {
          this.schema1.validateSync(element, opts)
        } else {
          this.schema2.validateSync(element, opts)
        }
      } catch (e) {
        e.inner.forEach(thrownError => {
          const error = cloneDeep(thrownError)
          error.path = `suggestedReviewers.${index}.${error.path}`
          errors.push(error)
        })
      }
    }

    if (errors.length) {
      const parentError = new ValidationError('reviewers went wrong')
      parentError.inner = errors
      throw parentError
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
        return validator.validate(value, this)
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
