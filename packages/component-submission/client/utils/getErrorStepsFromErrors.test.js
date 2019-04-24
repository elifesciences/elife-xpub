import {
  getStepFromFieldName,
  getErrorStepsFromErrors,
} from './getErrorStepsFromErrors'

import { STEP_NAMES, FIELD_TO_STEP_MAP } from './constants'

describe('getStepFromFieldName', () => {
  it('returns the correct step when  passed field name', () => {
    expect(getStepFromFieldName('author')).toEqual(STEP_NAMES.AUTHOR)
    expect(getStepFromFieldName('fileStatus')).toEqual(STEP_NAMES.FILES)
    expect(getStepFromFieldName('meta')).toEqual(STEP_NAMES.SUBMISSION)
    expect(getStepFromFieldName('opposedReviewers')).toEqual(STEP_NAMES.EDITORS)
    expect(getStepFromFieldName('submitterSignature')).toEqual(
      STEP_NAMES.DISCLOSURE,
    )
  })
})

describe('getErrorStepsFromErrors', () => {
  it('returns empty array when no error object is passed', () => {
    expect(getErrorStepsFromErrors()).toHaveLength(0)
  })
  it('returns the correct number of steps when passed duplicate step fields', () => {
    expect(getErrorStepsFromErrors(FIELD_TO_STEP_MAP)).toHaveLength(
      Object.keys(STEP_NAMES).length,
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
