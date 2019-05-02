import * as yup from 'yup'
import { yupToFormErrors } from 'formik'

import {
  disclosureSchema,
  editorsSchema,
  filesSchema,
} from './ValidationSchemas'
import { errorMessageMapping } from './constants'

describe('Editors Schema', () => {
  const validEditorData = {
    suggestedSeniorEditors: [{ id: 1 }, { id: 2 }],
    opposedSeniorEditors: [],
    opposedSeniorEditorsReason: '',
    suggestedReviewingEditors: [{ id: 1 }, { id: 2 }],
    opposedReviewingEditors: [{ id: 3 }],
    opposedReviewingEditorsReason: 'Just because',
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
  const schema = yup.object().shape(editorsSchema)
  it('allows valid data', () => {
    expect(() => schema.validateSync(validEditorData)).not.toThrow()
  })

  it('stops invalid data', () => {
    const invalidData = {
      suggestedSeniorEditors: [{ id: 1 }],
      opposedSeniorEditors: [{ id: 2 }],
      opposedSeniorEditorsReason: '',
      suggestedReviewingEditors: [],
      opposedReviewingEditors: [{ id: 1 }, { id: 2 }, { id: 3 }],
      opposedReviewingEditorsReason: '',
      suggestedReviewers: [{ name: '', email: 'bloop' }],
      opposedReviewers: [{ name: 'Jane Doe', email: 'jane@doe.com' }],
      opposedReviewersReason: '',
    }

    let errors = 'chickens'
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
      opposedReviewersReason: 'Please provide a reason for exclusion',
    })
  })

  it('stops invalid suggested reviewer with no name', () => {
    const testData = { ...validEditorData }
    testData.suggestedReviewers = [{ name: '', email: 'email@email.com' }]
    let errors
    try {
      schema.validateSync(testData, { abortEarly: false })
    } catch (e) {
      errors = yupToFormErrors(e)
    }

    expect(errors).toEqual({
      suggestedReviewers: [{ name: 'Name is required' }],
    })
  })

  it('stops invalid suggested reviewer with no email', () => {
    const testData = { ...validEditorData }
    testData.suggestedReviewers = [{ name: 'Name', email: '' }]
    let errors
    try {
      schema.validateSync(testData, { abortEarly: false })
    } catch (e) {
      errors = yupToFormErrors(e)
    }

    expect(errors).toEqual({
      suggestedReviewers: [{ email: 'Email is required' }],
    })
  })
})

describe('Disclosure Schema', () => {
  const schema = yup.object().shape(disclosureSchema)
  it('allows valid data', () => {
    const validData = {
      submitterSignature: 'Jo Franchetti',
      disclosureConsent: true,
    }
    expect(() => schema.validateSync(validData)).not.toThrow()
  })

  it('registers empty name as invalid', () => {
    const invalidData = {
      submitterSignature: '',
      disclosureConsent: true,
    }

    let errors
    try {
      schema.validateSync(invalidData, { abortEarly: false })
    } catch (e) {
      errors = yupToFormErrors(e)
    }

    expect(errors).toEqual({ submitterSignature: 'Your name is required' })
  })

  it('registers an unchecked consent box as invalid', () => {
    const invalidData = {
      submitterSignature: 'Jo Franchetti',
      disclosureConsent: false,
    }

    let errors
    try {
      schema.validateSync(invalidData, { abortEarly: false })
    } catch (e) {
      errors = yupToFormErrors(e)
    }

    expect(errors).toEqual({
      disclosureConsent: 'We are unable to proceed without your consent',
    })
  })
})

describe('Files schema', () => {
  const schema = yup.object().shape(filesSchema)
  it('allows valid data', () => {
    const validData = {
      coverLetter: 'Please accept my submission.',
      files: [{}],
      fileStatus: 'READY',
    }
    expect(() => schema.validateSync(validData)).not.toThrow()
  })
  it('returns correct error message when cover letter is empty', () => {
    const invalidData = {
      coverLetter: '',
      files: [{}],
      fileStatus: 'READY',
    }
    let errors
    try {
      schema.validateSync(invalidData, { abortEarly: false })
    } catch (e) {
      errors = yupToFormErrors(e)
    }

    expect(errors).toEqual({
      coverLetter: 'Please write or paste in your cover letter.',
    })
  })
  it('returns correct error message when files are not all uploaded and saved', () => {
    const invalidData = {
      coverLetter: 'Please accept my submission.',
      files: [{}],
      fileStatus: 'UPLOADED',
    }
    let errors
    try {
      schema.validateSync(invalidData, { abortEarly: false })
    } catch (e) {
      errors = yupToFormErrors(e)
    }

    expect(errors).toEqual({
      fileStatus: 'Please wait until all files have uploaded.',
    })
  })
  it('returns the correct error message when there are no files stored', () => {
    const invalidData = {
      coverLetter: 'Please accept my submission.',
      files: [],
      fileStatus: 'READY',
    }
    let errors
    try {
      schema.validateSync(invalidData, { abortEarly: false })
    } catch (e) {
      errors = yupToFormErrors(e)
    }

    expect(errors).toEqual({
      files: errorMessageMapping.EMPTY,
    })
  })
})
