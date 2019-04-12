import { cloneDeep } from 'lodash'

export function parseCosubmissionInput(cosubmissionValues = []) {
  const returnObject = {}

  returnObject.firstCosubmissionTitle = cosubmissionValues.length
    ? cosubmissionValues[0]
    : null
  returnObject.secondCosubmissionTitle =
    cosubmissionValues.length > 1 ? cosubmissionValues[1] : null

  return returnObject
}

function parseInputToFormData(values) {
  return {
    ...cloneDeep(values),
    ...parseCosubmissionInput(values.cosubmission),
  }
}

export default parseInputToFormData
