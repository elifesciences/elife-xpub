import yup, { ValidationError } from 'yup'
import { cloneDeep } from 'lodash'

const NUM_MANDATORY = 3

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

    this.MAXIMUM = 6
  }

  validate(reviewers, parentYup) {
    const errors = []
    const opts = { abortEarly: false }

    if (!reviewers) {
      // invalid if no reviewer specified
      return false
    }

    for (let index = 0; index < reviewers.length; index += 1) {
      const element = reviewers[index]
      try {
        if (index < NUM_MANDATORY) {
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
      this.throwValidationError('reviewers went wrong', errors)
    }

    if (reviewers.length < NUM_MANDATORY) {
      this.throwValidationError(`Need at least ${NUM_MANDATORY}`)
    }

    if (reviewers.length > this.MAXIMUM) {
      this.throwValidationError(`Cannot exceed ${this.MAXIMUM}`)
    }

    // TODO: Check for dups

    return true
  }

  throwValidationError = (message, errors) => {
    const parentError = new ValidationError(message)
    parentError.path = 'suggestedReviewers'
    parentError.inner = errors
    throw parentError
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

  static removeBlankReviewers(formats, parseStrict) {
    return this.transform((value, originalValue) => {
      if (!value || value.length <= NUM_MANDATORY) {
        return
      }
      // minus 2 as we never check the last one
      for (let index = value.length - 2; index >= 0; index -= 1) {
        const element = value[index]
        const elementIsBlank = element.name + element.email === ''
        if (elementIsBlank) {
          if (value.length > NUM_MANDATORY) {
            console.log('~~~ REMOVING REVIEWER', index)
            value.splice(index, 1)
          }
        }
      }
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

const addRemoveBlanks = () => {
  yup.addMethod(
    yup.array,
    'removeBlankReviewers',
    SuggestedReviewersValidator.removeBlankReviewers,
  )
}

addValidReviewers()
addRemoveBlanks()
