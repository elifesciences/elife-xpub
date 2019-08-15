import omitDeep from 'omit-deep-lodash'
import { FORM_FIELDS_TO_OMIT } from './constants'

export function parseCosubmissionFormData(values) {
  const { firstCosubmissionTitle, secondCosubmissionTitle } = values
  const returnValue = { cosubmission: [] }

  if (firstCosubmissionTitle && firstCosubmissionTitle.length) {
    returnValue.cosubmission.push(firstCosubmissionTitle)
    if (secondCosubmissionTitle && secondCosubmissionTitle.length) {
      returnValue.cosubmission.push(secondCosubmissionTitle)
    }
  }

  return returnValue
}

export function parseEditorSuggestionsData(values) {
  const editorFields = [
    'suggestedSeniorEditors',
    'opposedSeniorEditors',
    'suggestedReviewingEditors',
    'opposedReviewingEditors',
  ]

  const returnObject = {}

  editorFields.forEach(field => {
    if (values[field])
      returnObject[field] = values[field].map(person => person.id)
  })

  return returnObject
}

export function parseReviewersData({ suggestedReviewers, opposedReviewers }) {
  const itemNotBlank = item => item.name + item.email !== ''
  const filtered = {}

  if (suggestedReviewers !== undefined) {
    filtered.suggestedReviewers = suggestedReviewers.filter(itemNotBlank)
  }

  if (opposedReviewers !== undefined) {
    filtered.opposedReviewers = opposedReviewers.filter(itemNotBlank)
  }

  return filtered
}

function parseFormToOutputData(formValues) {
  return {
    ...omitDeep(formValues, FORM_FIELDS_TO_OMIT),
    ...parseCosubmissionFormData(formValues),
    ...parseReviewersData(formValues),
    ...parseEditorSuggestionsData(formValues),
  }
}

export default parseFormToOutputData
