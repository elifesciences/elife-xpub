/* eslint-disable no-param-reassign */
export default class EditorSuggestionsModifier {
  omitList = () => []

  toForm = values => {}

  fromForm = values => {
    const keys = [
      'suggestedSeniorEditors',
      'opposedSeniorEditors',
      'suggestedReviewingEditors',
      'opposedReviewingEditors',
    ]
    keys.forEach(key => {
      values[key] = values[key].map(person => person.id)
    })
  }
}
