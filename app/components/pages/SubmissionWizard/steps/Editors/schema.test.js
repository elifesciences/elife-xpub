import { yupToFormErrors } from 'formik'
import { schema } from './schema'

describe('Editors form validation', () => {
  it('allows valid data', () => {
    const validData = {
      suggestedSeniorEditors: [{ id: 1 }, { id: 2 }],
      opposedSeniorEditors: [],
      opposedSeniorEditorsReason: '',
      suggestedReviewingEditors: [{ id: 1 }, { id: 2 }],
      opposedReviewingEditors: [{ id: 3 }],
      opposedReviewingEditorsReason: 'Just because',
      suggestionsConflict: true,
      suggestedReviewers: [
        { name: 'A', email: 'a@here.com' },
        { name: 'B', email: 'b@here.com' },
        { name: 'C', email: 'c@here.com' },
      ],
      opposedReviewers: [
        { name: 'D', email: 'd@here.com' },
        { name: 'E', email: 'e@here.com' },
      ],
      opposedReviewersReason: 'Some conflict',
    }

    expect(() => schema.validateSync(validData)).not.toThrow()
  })

  it('stops invalid data', () => {
    const invalidData = {
      suggestedSeniorEditors: [{ id: 1 }],
      opposedSeniorEditors: [{ id: 2 }],
      opposedSeniorEditorsReason: '',
      suggestedReviewingEditors: [],
      opposedReviewingEditors: [{ id: 1 }, { id: 2 }, { id: 3 }],
      opposedReviewingEditorsReason: '',
      suggestionsConflict: false,
      suggestedReviewers: [{ name: '', email: 'bloop' }],
      opposedReviewers: [{ name: 'Jane Doe', email: 'jane@doe.com' }],
      opposedReviewersReason: '',
    }

    let errors
    try {
      schema.validateSync(invalidData, { abortEarly: false })
    } catch (e) {
      errors = yupToFormErrors(e)
    }

    expect(errors).toEqual({
      opposedReviewingEditors: 'Please suggest no more than 2 editors',
      opposedReviewingEditorsReason: 'Please provide a reason for exclusion',
      opposedSeniorEditorsReason: 'Please provide a reason for exclusion',
      suggestedReviewers: [
        { email: 'Must be a valid email', name: 'Name is required' },
      ],
      suggestedReviewingEditors: 'Please suggest at least 2 editors',
      suggestedSeniorEditors: 'Please suggest at least 2 editors',
      suggestionsConflict:
        'Please do not suggest people with a known conflict of interest',
      opposedReviewersReason: 'Please provide a reason for exclusion',
    })
  })
})
