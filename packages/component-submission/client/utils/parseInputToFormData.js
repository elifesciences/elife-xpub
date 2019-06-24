import { cloneDeep } from 'lodash'

export function parseCosubmissionInput(cosubmissionValues = []) {
  return {
    firstCosubmissionTitle: cosubmissionValues.length
      ? cosubmissionValues[0]
      : null,
    secondCosubmissionTitle:
      cosubmissionValues.length > 1 ? cosubmissionValues[1] : null,
  }
}

// This basically sets the initial values
function parseInputToFormData(values) {
  return {
    ...cloneDeep(values),
    ...parseCosubmissionInput(values.cosubmission),
  }
}

export default parseInputToFormData
