import { FIELD_TO_STEP_MAP } from './constants'

export const getStepFromFieldName = fieldName => FIELD_TO_STEP_MAP[fieldName]

export const getErrorStepsFromErrors = (errorObject = {}) => {
  const steps = Object.keys(errorObject).map(fieldName =>
    getStepFromFieldName(fieldName),
  )
  return [...new Set(steps)]
}
