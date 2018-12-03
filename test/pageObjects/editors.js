import config from 'config'
import { Selector } from 'testcafe'

const editors = {
  url: new RegExp(
    `${config.get('pubsweet-server.baseUrl')}/submit/[a-f0-9-]{36}/editors`,
  ),
  selectedPeople: Selector('[data-test-id="selected-item"]'),
  suggestedSeniorEditorSelection: Selector(
    '[data-test-id="suggested-senior-editors"] [data-test-id="person-pod-button"]',
  ),
  suggestedReviewingEditorSelection: Selector(
    '[data-test-id="suggested-reviewing-editors"] [data-test-id="person-pod-button"]',
  ),
  personPodInfoButtons: Selector('[data-test-id="info-button"]'),
  cancelInfoModal: Selector('[data-test-id="info-modal"]').find(
    '[data-test-id="modal-dialog-cancel"]',
  ),
  acceptInfoModal: Selector('[data-test-id="info-modal"]').find(
    '[data-test-id="modal-dialog-accept"]',
  ),
  peoplePickerOptions: Selector(
    '[data-test-id="people-picker-body"] [data-test-id="person-pod-button"]',
  ),
  peoplePickerSubmit: Selector('[data-test-id="people-picker-add"]'),
  firstReviewerName: Selector('[name="suggestedReviewers.0.name"]'),
  firstReviewerEmail: Selector('[name="suggestedReviewers.0.email"]'),
  secondReviewerName: Selector('[name="suggestedReviewers.1.name"]'),
  secondReviewerEmail: Selector('[name="suggestedReviewers.1.email"]'),
  thirdReviewerName: Selector('[name="suggestedReviewers.2.name"]'),
  thirdReviewerEmail: Selector('[name="suggestedReviewers.2.email"]'),
  fourthReviewerName: Selector('[name="suggestedReviewers.3.name"]'),
  fourthReviewerEmail: Selector('[name="suggestedReviewers.3.email"]'),
  fifthReviewerName: Selector('[name="suggestedReviewers.4.name"]'),
  fifthReviewerEmail: Selector('[name="suggestedReviewers.4.email"]'),
  sixthReviewerName: Selector('[name="suggestedReviewers.5.name"]'),
  sixthReviewerEmail: Selector('[name="suggestedReviewers.5.email"]'),
  conflictOfInterest: Selector('[name=suggestionsConflict]').parent(),
  validationErrors: Selector('[data-test-id^="error-"]'),
}

export default editors
