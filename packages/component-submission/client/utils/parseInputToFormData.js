import { cloneDeep, sortBy, last } from 'lodash'

export function parseCosubmissionInput(cosubmissionValues = []) {
  return {
    firstCosubmissionTitle: cosubmissionValues.length
      ? cosubmissionValues[0]
      : null,
    secondCosubmissionTitle:
      cosubmissionValues.length > 1 ? cosubmissionValues[1] : null,
  }
}

export function parseTitleSuggestion(values) {
  if (!values.suggestions) {
    return {}
  }
  const latestSuggestions = values.suggestions.reduce(
    (acc, sugg) => ({
      ...acc,

      // NOTE: The 'score' value is calculated from the sequence of suggestions
      // the higher the score, the later the suggestion was suggested
      // So here we take the highest score to give the user the latest suggestion

      [sugg.fieldName]: last(sortBy(sugg.suggestions, ['score'])).value,
    }),
    {},
  )

  if (!values.meta.title && latestSuggestions.title) {
    return {
      meta: { ...values.meta, title: latestSuggestions.title },
    }
  }
  return {}
}

// This basically sets the initial values
function parseInputToFormData(values) {
  return {
    ...cloneDeep(values),
    ...parseCosubmissionInput(values.cosubmission),
    ...parseTitleSuggestion(values),
  }
}

export default parseInputToFormData
