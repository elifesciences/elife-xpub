import {
  getStepFromFieldName,
  getErrorStepsFromErrors,
} from './getErrorStepsFromErrors'

import { STEP_NAMES, FIELD_TO_STEP_MAP } from './constants'

describe('getStepFromFieldName', () => {
  it('returns the correct step when  passed field name', () => {
    expect(getStepFromFieldName('author')).toEqual('Author')
    expect(getStepFromFieldName('fileStatus')).toEqual('Files')
    expect(getStepFromFieldName('meta')).toEqual('Details')
    expect(getStepFromFieldName('opposedReviewers')).toEqual('Editors')
    expect(getStepFromFieldName('submitterSignature')).toEqual('Disclosure')
  })
})

describe('getErrorStepsFromErrors', () => {
  it('returns empty array when no error object is passed', () => {
    expect(getErrorStepsFromErrors()).toHaveLength(0)
  })
  it('returns the correct number of steps when passed duplicate step fields', () => {
    expect(getErrorStepsFromErrors(FIELD_TO_STEP_MAP)).toHaveLength(
      STEP_NAMES.length,
    )
  })
  it('returns correct steps when passed error values', () => {
    const dummyError = {
      fileStatus: 'Error',
      meta: { title: 'Error' },
      suggestedReviewers: 'Error',
    }

    expect(getErrorStepsFromErrors(dummyError)).toEqual(
      expect.arrayContaining(['Files', 'Details', 'Editors']),
    )
  })
})
