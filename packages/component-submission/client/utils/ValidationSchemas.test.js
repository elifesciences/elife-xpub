import * as yup from 'yup'
import { yupToFormErrors } from 'formik'

import {
  disclosureSchema,
  editorsSchema,
  filesSchema,
  submissionSchema,
  authorSchema,
} from './ValidationSchemas'
import { errorMessageMapping } from './constants'

const hiddenWhitespace = '\u2000\u00A0\u200A\u2028\u2029\u202F\u205F\u3000'

describe('Authors Schema', () => {
  const validAuthorData = {
    author: {
      firstName: 'Adam',
      lastName: 'Shinkicker',
      email: 'author@email.com',
      aff: 'University of Life',
    },
  }
  const schema = yup.object().shape(authorSchema)
  it('allows valid data', () => {
    expect(() => schema.validateSync(validAuthorData)).not.toThrow()
  })

  it('trims email of whitespace', () => {
    const testData = { ...validAuthorData }
    testData.author.email = `${hiddenWhitespace}bob@email.com${hiddenWhitespace}`
    const newData = schema.validateSync(testData, { abortEarly: false })
    expect(newData.author.email).toEqual('bob@email.com')
  })
})

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
      opposedReviewers: [{ name: '', email: 'boop' }],
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
      opposedReviewers: [
        { email: 'Must be a valid email', name: 'Name is required' },
      ],
      suggestedReviewingEditors: 'Please suggest at least 2 editors',
      suggestedSeniorEditors: 'Please suggest at least 2 editors',
      opposedReviewersReason: 'Please provide a reason for exclusion',
    })
  })

  it('trims all emails of whitespace', () => {
    const testData = { ...validEditorData }
    testData.suggestedReviewers = [
      {
        name: 'bob',
        email: `${hiddenWhitespace}bob@email.com${hiddenWhitespace}`,
      },
    ]
    testData.opposedReviewers = [
      {
        name: 'fred',
        email: `${hiddenWhitespace}fred@email.com${hiddenWhitespace}`,
      },
    ]

    const newData = schema.validateSync(testData, { abortEarly: false })

    expect(newData.suggestedReviewers).toHaveLength(1)
    expect(newData.suggestedReviewers[0]).toEqual({
      name: 'bob',
      email: `bob@email.com`,
    })
    expect(newData.opposedReviewers).toHaveLength(1)
    expect(newData.opposedReviewers[0]).toEqual({
      name: 'fred',
      email: `fred@email.com`,
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

  it('stops invalid opposed reviewer with no name', () => {
    const testData = { ...validEditorData }
    testData.opposedReviewers = [{ name: '', email: 'email@email.com' }]
    let errors
    try {
      schema.validateSync(testData, { abortEarly: false })
    } catch (e) {
      errors = yupToFormErrors(e)
    }

    expect(errors).toEqual({
      opposedReviewers: [{ name: 'Name is required' }],
    })
  })

  it('stops invalid opposed reviewer with no email', () => {
    const testData = { ...validEditorData }
    testData.opposedReviewers = [{ name: 'Name', email: '' }]
    let errors
    try {
      schema.validateSync(testData, { abortEarly: false })
    } catch (e) {
      errors = yupToFormErrors(e)
    }

    expect(errors).toEqual({
      opposedReviewers: [{ email: 'Email is required' }],
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
      files: [{ type: 'MANUSCRIPT_SOURCE' }],
      fileStatus: 'READY',
    }
    expect(() => schema.validateSync(validData)).not.toThrow()
  })
  it('returns correct error message when cover letter is empty', () => {
    const invalidData = {
      coverLetter: '',
      files: [{ type: 'MANUSCRIPT_SOURCE' }],
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
      files: [{ type: 'MANUSCRIPT_SOURCE' }],
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
  it('returns the correct error message when there are supporting files stored but no manuscripts', () => {
    const invalidData = {
      coverLetter: 'Please accept my submission.',
      files: [{ type: 'SUPPORTING_FILE' }],
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

describe('Submission Schema', () => {
  const subSchema = yup.object().shape(submissionSchema)
  const validSubmission = {
    meta: {
      title: 'some text',
      articleType: 'article',
      subjects: ['fantasy, sci-fi'],
    },
    previouslyDiscussed: 'yes',
    previouslySubmitted: ['nope'],
    firstCosubmissionTitle: 'blah',
  }

  it('allows valid data', () => {
    expect(() => subSchema.validateSync(validSubmission)).not.toThrow()
  })

  it('throws the correct errors on the subjects field', () => {
    const invalidMetaSubmission = Object.assign({}, validSubmission)
    invalidMetaSubmission.meta.subjects = []
    let errors
    try {
      subSchema.validateSync(invalidMetaSubmission, { abortEarly: false })
    } catch (e) {
      errors = yupToFormErrors(e)
    }

    expect(errors).toEqual({
      meta: {
        subjects: 'Subject area(s) required',
      },
    })
    invalidMetaSubmission.meta.subjects.push(...['blah', 'bleigh', 'blob'])
    try {
      subSchema.validateSync(invalidMetaSubmission, { abortEarly: false })
    } catch (e) {
      errors = yupToFormErrors(e)
    }

    expect(errors).toEqual({
      meta: {
        subjects: 'No more than 2 subject areas',
      },
    })
  })

  it('does not require subjects when the article type is feature', () => {
    const featureSubmission = Object.assign({}, validSubmission)
    featureSubmission.meta.articleType = 'feature'
    delete featureSubmission.meta.subjects
    expect(() => subSchema.validateSync(featureSubmission)).not.toThrow()

    featureSubmission.meta.subjects = ['blah']
    expect(() => subSchema.validateSync(featureSubmission)).not.toThrow()

    featureSubmission.meta.subjects.push('bleigh')
    expect(() => subSchema.validateSync(featureSubmission)).not.toThrow()

    featureSubmission.meta.subjects.push('TOO MANY')
    let errors
    try {
      subSchema.validateSync(featureSubmission, { abortEarly: false })
    } catch (e) {
      errors = yupToFormErrors(e)
    }
    expect(errors).toEqual({
      meta: {
        subjects: 'No more than 2 subject areas',
      },
    })
  })

  it('throws the correct errors on the non subject fields', () => {
    const invalidMetaSubmission = {
      meta: {
        title: '',
        articleType: '',
        subjects: ['bleigh'],
      },
      previouslyDiscussed: '',
      previouslySubmitted: [''],
      firstCosubmissionTitle: '',
    }
    let errors
    try {
      subSchema.validateSync(invalidMetaSubmission, { abortEarly: false })
    } catch (e) {
      errors = yupToFormErrors(e)
    }

    expect(errors).toEqual({
      meta: {
        title: 'Title is required',
        articleType: 'Article type is required',
      },
      previouslyDiscussed: 'Please describe your previous interaction',
      previouslySubmitted: ['Article title is required'],
      firstCosubmissionTitle: 'Article title is required',
    })
  })
})
