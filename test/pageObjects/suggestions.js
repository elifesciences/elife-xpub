import config from 'config'
import { Selector, t } from 'testcafe'

const suggestions = {
  url: `${config.get('pubsweet-server.baseUrl')}/submit/suggestions`,
  fillWithDummyData: () =>
    t
      .typeText('[name="suggestedSeniorEditors.0"]', 'Angela')
      .typeText('[name="suggestedSeniorEditors.1"]', 'Bobby')
      .typeText('[name="suggestedReviewingEditors.0"]', 'Charlie')
      .typeText('[name="suggestedReviewingEditors.1"]', 'Delia')
      .typeText('[name="suggestedReviewers.0.name"]', 'Edward')
      .typeText('[name="suggestedReviewers.0.email"]', 'edward@example.com')
      .typeText('[name="suggestedReviewers.1.name"]', 'Frances')
      .typeText('[name="suggestedReviewers.1.email"]', 'frances@example.net')
      .typeText('[name="suggestedReviewers.2.name"]', 'George')
      .typeText('[name="suggestedReviewers.2.email"]', 'george@example.org'),
  conflictOfInterest: Selector('[name=noConflictOfInterest]').parent(),
}

export default suggestions
