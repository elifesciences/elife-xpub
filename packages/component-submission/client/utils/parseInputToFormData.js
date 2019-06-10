import { cloneDeep } from 'lodash'

export function parseCosubmissionInput(cosubmissionValues = []) {
  return {
    firstCosubmissionTitle: cosubmissionValues.length
      ? cosubmissionValues[0]
      : null,
    secondCosubmissionTitle:
      cosubmissionValues.lengt > 1 ? cosubmissionValues[1] : null,
  }
}

function parseInputToFormData(values) {
  return {
    ...cloneDeep(values),
    ...parseCosubmissionInput(values.cosubmission),
  }
}

export default parseInputToFormData
