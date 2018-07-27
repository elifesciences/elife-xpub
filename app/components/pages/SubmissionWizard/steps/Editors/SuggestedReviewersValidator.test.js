import { cloneDeep } from 'lodash'
import yup from 'yup'
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

const expectToHaveBadEmail = reviewers => {
  expect(() => {
    schema.validateSync(reviewers)
  }).toThrow('Must be a valid email')
}

const isCheckingEmail = index => {
  const data = cloneDeep(validReviewers)
  data[index].email = 'not-an-email'

  it(`fails when reviewer ${index + 1} has bad email`, () => {
    expectToHaveBadEmail(data)
  })
}

const isNotCheckingEmail = index => {
  const data = cloneDeep(validReviewers)
  data[index].email = 'not-an-email'

  it(`fails when reviewer ${index + 1} has bad email`, () => {
    schema.validateSync(data)
  })
}

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
