import {
  stepName,
  fieldToStepMap,
  getStepFromFieldName,
  getErrorStepsFromErrors,
} from './getErrorStepsFromErrors'

describe('getStepFromFieldName', () => {
  it('returns the correct step when  passed field name', () => {
    expect(getStepFromFieldName('author')).toEqual(stepName.AUTHOR)
    expect(getStepFromFieldName('fileStatus')).toEqual(stepName.FILES)
    expect(getStepFromFieldName('meta')).toEqual(stepName.SUBMISSION)
    expect(getStepFromFieldName('opposedReviewers')).toEqual(stepName.EDITORS)
    expect(getStepFromFieldName('submitterSignature')).toEqual(
      stepName.DISCLOSURE,
    )
  })
})

describe('getErrorStepsFromErrors', () => {
  it('returns empty array when no error object is passed', () => {
    expect(getErrorStepsFromErrors()).toHaveLength(0)
  })
  it('returns the correct number of steps when passed duplicate step fields', () => {
    expect(getErrorStepsFromErrors(fieldToStepMap)).toHaveLength(
      Object.keys(stepName).length,
    )
  })
  it('returns correct steps when passed error values', () => {
    const dummyError = {
      fileStatus: 'Error',
      meta: { title: 'Error' },
      suggestedReviewers: 'Error',
    }

    expect(getErrorStepsFromErrors(dummyError)).toEqual(
      expect.arrayContaining(['Files', 'Submission', 'Editors']),
    )
  })
})
