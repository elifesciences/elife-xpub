import yup, { ValidationError } from 'yup'
import { cloneDeep, countBy, findIndex } from 'lodash'

const MIN_REVIEWERS = 3
const MAX_REVIEWERS = 6

export const suggestedReviewersLimits = {
  min: MIN_REVIEWERS,
  max: MAX_REVIEWERS,
}

class SuggestedReviewersValidator {
  constructor() {
    this.schema = yup.object({
      name: yup.string().required('Name is required'),
      email: yup
        .string()
        .email('Must be a valid email')
        .required('Email is required'),
    })
    this.thingsNotDuplicated = ['name', 'email']
  }

  checkArrayContents(reviewers, errors) {
    const opts = { abortEarly: false }
    for (let index = 0; index < reviewers.length; index += 1) {
      const element = reviewers[index]
      const isBlank = element.name + element.email === ''

      try {
        if (index < MIN_REVIEWERS || (index >= MIN_REVIEWERS && !isBlank)) {
          this.schema.validateSync(element, opts)
        }
      } catch (e) {
        e.inner.forEach(thrownError => {
          const error = cloneDeep(thrownError)
          error.path = `suggestedReviewers.${index}.${error.path}`
          errors.push(error)
        })
      }
    }
  }

  static checkArrayForDuplicateByKey(key, reviewers) {
    const dupIndexes = []
    // Check for duplicates
    const results = countBy(reviewers, key)
    Object.keys(results).map(item => {
      if (results[item] > 1) {
        const search = {}
        search[key] = item
        // don't mark blanks as duplicates
        if (item !== '') {
          const offendingIndex = findIndex(reviewers, search)
          dupIndexes.push(offendingIndex)
        }
      }
      return true
    })
    // return list of offending indexes
    return dupIndexes
  }

  checkArrayForDuplicates(reviewers, errors) {
    this.thingsNotDuplicated.forEach(key => {
      const dupIndexes = SuggestedReviewersValidator.checkArrayForDuplicateByKey(
        key,
        reviewers,
      )
      if (dupIndexes.length > 0) {
        // create errors here
        dupIndexes.forEach(index => {
          const e = new ValidationError(`Duplicated ${key}`)
          e.path = `suggestedReviewers.${index}.${key}`
          errors.push(e)
        })
      }
    })
  }

  static removeOptionalBlankReviewers(reviewers) {
    const itemIsBlank = item => item.name + item.email === ''

    let numBlanks = 0
    for (let index = reviewers.length - 1; index >= MIN_REVIEWERS; index -= 1) {
      const item = reviewers[index]
      if (itemIsBlank(item)) {
        numBlanks += 1
      } else {
        break
      }
    }

    if (numBlanks > 0) {
      const numToGo = numBlanks - 1
      reviewers.splice(reviewers.length - numToGo, numToGo)
    }
  }

  validate(reviewers, parentYup) {
    const errors = []

    if (!reviewers) {
      // invalid if no reviewers specified
      return false
    }

    this.checkArrayContents(reviewers, errors)
    this.checkArrayForDuplicates(reviewers, errors)

    if (errors.length) {
      this.throwValidationError('reviewers went wrong', errors)
    }

    if (reviewers.length < MIN_REVIEWERS) {
      this.throwValidationError(`Need at least ${MIN_REVIEWERS}`)
    }

    if (reviewers.length > this.MAX_REVIEWERS) {
      this.throwValidationError(`Cannot exceed ${MAX_REVIEWERS}`)
    }

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
}

const addValidReviewers = () => {
  yup.addMethod(
    yup.array,
    'validReviewers',
    SuggestedReviewersValidator.validReviewers,
  )
}

addValidReviewers()
