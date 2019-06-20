import { sortBy, last } from 'lodash'

export default function(fieldName, values) {
  if (!values.suggestions) {
    return ''
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

  return latestSuggestions[fieldName]
}
