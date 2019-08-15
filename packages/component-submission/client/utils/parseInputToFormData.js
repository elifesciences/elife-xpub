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

export function parseSuggestedReviewers({ suggestedReviewers }) {
  if (suggestedReviewers !== undefined) {
    return suggestedReviewers.length === 0
      ? { suggestedReviewers: [{ name: '', email: '' }] }
      : { suggestedReviewers }
  }

  return {}
}

// This basically sets the initial values
function parseInputToFormData(values) {
  return {
    ...cloneDeep(values),
    ...parseSuggestedReviewers(values),
    ...parseCosubmissionInput(values.cosubmission),
  }
}

export default parseInputToFormData
