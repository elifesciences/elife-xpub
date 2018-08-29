import config from 'config'
import { Selector, t } from 'testcafe'

const suggestions = {
  url: `${config.get('pubsweet-server.baseUrl')}/submit/editors`,
  suggestedSeniorEditorSelection: Selector(
    '[data-test-id="suggested-senior-editors"] [data-test-id="person-pod-button"]',
  ),
  suggestedReviewingEditorSelection: Selector(
    '[data-test-id="suggested-reviewing-editors"] [data-test-id="person-pod-button"]',
  ),
  peoplePickerOptions: Selector(
    '[data-test-id="people-picker-body"] [data-test-id="person-pod-button"]',
  ),
  peoplePickerSubmit: Selector('[data-test-id="people-picker-add"]'),
  fillWithDummyData: () =>
    t
      .click(suggestions.suggestedSeniorEditorSelection)
      .click(suggestions.peoplePickerOptions.nth(0))
      .click(suggestions.peoplePickerOptions.nth(2))
      .click(suggestions.peoplePickerSubmit)
      .click(suggestions.suggestedReviewingEditorSelection)
      .click(suggestions.peoplePickerOptions.nth(1))
      .click(suggestions.peoplePickerOptions.nth(4))
      .click(suggestions.peoplePickerSubmit)
      .typeText('[name="suggestedReviewers.0.name"]', 'Edward')
      .typeText('[name="suggestedReviewers.0.email"]', 'edward@example.com')
      .typeText('[name="suggestedReviewers.1.name"]', 'Frances')
      .typeText('[name="suggestedReviewers.1.email"]', 'frances@example.net')
      .typeText('[name="suggestedReviewers.2.name"]', 'George')
      .typeText('[name="suggestedReviewers.2.email"]', 'george@example.org'),
  conflictOfInterest: Selector('[name=suggestionsConflict]').parent(),
}

export default suggestions
