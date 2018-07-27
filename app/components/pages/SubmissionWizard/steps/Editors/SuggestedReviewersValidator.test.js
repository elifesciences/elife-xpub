import { cloneDeep } from 'lodash'
import yup, { ValidationError } from 'yup'
import './SuggestedReviewersValidator'

const schema = yup.array().validReviewers()

const validReviewers = [
  { name: 'albert', email: 'a@here.com' },
  { name: 'bobby', email: 'b@here.com' },
  { name: 'cuthbert', email: 'c@here.com' },
  { name: 'david', email: 'd@here.com' },
  { name: 'edward', email: 'e@here.com' },
  { name: 'fred', email: 'f@here.com' },
]

const expectInvalidEmail = (error, index) => {
  const invalidEmail = 'ValidationError: Must be a valid email'
  expect(error.toString()).toBe(invalidEmail)
  expect(error.path).toBe(`suggestedReviewers.${index}.email`)
}

const expectInvalidName = (error, index) => {
  const invalidName = 'ValidationError: Name is required'
  expect(error.toString()).toBe(invalidName)
  expect(error.path).toBe(`suggestedReviewers.${index}.name`)
}

const expectToHaveBadEmail = (reviewers, index) => {
  try {
    schema.validateSync(reviewers)
  } catch (e) {
    expect(e.inner).toHaveLength(1)
    expectInvalidEmail(e.inner[0], index)
    throw e
  }
}

const expectToHaveBadName = (reviewers, index) => {
  try {
    schema.validateSync(reviewers)
  } catch (e) {
    expect(e.inner).toHaveLength(1)
    expectInvalidName(e.inner[0], index)
    throw e
  }
}

const expectToHaveBadNameAndEmail = (reviewers, index) => {
  try {
    schema.validateSync(reviewers)
  } catch (e) {
    expect(e.inner).toHaveLength(2)
    expectInvalidName(e.inner[0], index)
    expectInvalidEmail(e.inner[1], index)
    throw e
  }
}

const isCheckingNameAndEmail = index => {
  const data = cloneDeep(validReviewers)
  data[index].email = 'not-an-email'
  data[index].name = ''

  it(`fails when reviewer ${index + 1} has bad name and email`, () => {
    expect(() => expectToHaveBadNameAndEmail(data, index)).toThrow(
      ValidationError,
    )
  })
}

const isCheckingEmail = index => {
  const data = cloneDeep(validReviewers)
  data[index].email = 'not-an-email'

  it(`fails when reviewer ${index + 1} has bad email`, () => {
    expect(() => expectToHaveBadEmail(data, index)).toThrow(ValidationError)
  })
}

const isNotCheckingEmail = index => {
  const data = cloneDeep(validReviewers)
  data[index].email = 'not-an-email'

  it(`ok when reviewer ${index + 1} has bad email`, () => {
    schema.validateSync(data)
  })
}

const isCheckingName = index => {
  const data = cloneDeep(validReviewers)
  data[index].name = ''

  it(`fails when reviewer ${index + 1} has bad name`, () => {
    expect(() => expectToHaveBadName(data, index)).toThrow(ValidationError)
  })
}

const isNotCheckingName = index => {
  const data = cloneDeep(validReviewers)
  data[index].name = ''

  it(`ok when reviewer ${index + 1} has bad name`, () => {
    schema.validateSync(data)
  })
}

/*
 * Main test section
 */
describe('Happy day', () => {
  it('valid reviewer validate ok', () => {
    schema.validateSync(validReviewers)
  })
})

describe('First three need good emails', () => {
  for (let index = 0; index < validReviewers.length; index += 1) {
    if (index < 3) {
      isCheckingEmail(index)
    } else {
      isNotCheckingEmail(index)
    }
  }
})

describe('First three need good names', () => {
  for (let index = 0; index < validReviewers.length; index += 1) {
    if (index < 3) {
      isCheckingName(index)
    } else {
      isNotCheckingName(index)
    }
  }
})

describe('Multiple errors can be shown', () => {
  for (let index = 0; index < validReviewers.length; index += 1) {
    if (index < 3) {
      isCheckingNameAndEmail(index)
    }
  }
})
