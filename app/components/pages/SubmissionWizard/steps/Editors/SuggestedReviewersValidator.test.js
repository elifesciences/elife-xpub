import { cloneDeep } from 'lodash'
import * as yup from 'yup'
import './SuggestedReviewersValidator'
import { limits } from './schema'

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

const expectDuplicateEmail = (error, index) => {
  const duplicateEmail = 'ValidationError: Duplicated email'
  expect(error.toString()).toBe(duplicateEmail)
  expect(error.path).toBe(`suggestedReviewers.${index}.email`)
}

const expectDuplicateName = (error, index) => {
  const duplicateName = 'ValidationError: Duplicated name'
  expect(error.toString()).toBe(duplicateName)
  expect(error.path).toBe(`suggestedReviewers.${index}.name`)
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

const expectToHaveDuplicateNameAndEmail = (reviewers, index) => {
  try {
    schema.validateSync(reviewers)
  } catch (e) {
    expect(e.inner).toHaveLength(2)
    expectDuplicateName(e.inner[0], index)
    expectDuplicateEmail(e.inner[1], index)
    throw e
  }
}

const isCheckingNameAndEmail = index => {
  const data = cloneDeep(validReviewers)
  data[index].email = 'not-an-email'
  data[index].name = ''

  it(`fails when reviewer ${index + 1} has bad name and email`, () => {
    expect(() => expectToHaveBadNameAndEmail(data, index)).toThrow(
      yup.ValidationError,
    )
  })
}

const checksForDuplicate = index => {
  const data = cloneDeep(validReviewers)
  const dupIndex = 0
  data[index] = data[dupIndex]
  it('catches duplicate name and emails', () => {
    expect(() => expectToHaveDuplicateNameAndEmail(data, dupIndex)).toThrow(
      yup.ValidationError,
    )
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

describe('Multiple errors can be shown', () => {
  for (let index = 0; index < validReviewers.length; index += 1) {
    if (index < limits.suggestedReviewers.max) {
      isCheckingNameAndEmail(index)
    }
  }
})

describe('Duplicates are caught', () => {
  // check within the mandatory rows
  checksForDuplicate(2)
  // check within the optional rows too
  checksForDuplicate(5)
})
