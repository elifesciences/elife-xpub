import { ClientFunction, Selector } from 'testcafe'
import replaySetup from './helpers/replay-setup'
import {
  dashboard,
  wizardStep,
  authorDetails,
  fileUploads,
  metadata,
  suggestions,
  disclosure,
} from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'

const f = fixture('Submission')
setFixtureHooks(f)

const manuscript = {
  title: 'The Relationship Between Lamport Clocks and Interrupts Using Obi',
  file: './fixtures/dummy-manuscript-2.pdf',
}

const getPageUrl = ClientFunction(() => window.location.href)
const goBack = ClientFunction(() => window.history.back())

test('Happy path', async t => {
  replaySetup('success')
  await dashboard.login()
  await t.navigateTo(dashboard.url).click('[data-test-id=submit]')

  // author details initially empty
  await t
    .expect(authorDetails.firstNameField.value)
    .eql('')
    .expect(authorDetails.secondNameField.value)
    .eql('')
    .expect(authorDetails.emailField.value)
    .eql('')
    .expect(authorDetails.institutionField.value)
    .eql('')

  // author details pre-populated using Orcid API
  await t
    .click(authorDetails.orcidPrefill)
    .expect(authorDetails.firstNameField.value)
    .eql('Test', 'First name is populated by query to the Orcid API')
    .expect(authorDetails.secondNameField.value)
    .eql('User', 'Last name is populated by query to the Orcid API')
    .expect(authorDetails.emailField.value)
    .eql('elife@mailinator.com', 'Email is populated by query to the Orcid API')
    .expect(authorDetails.institutionField.value)
    .eql(
      'University of eLife',
      'Institution is populated by query to the Orchid API',
    )
    .click(wizardStep.next)

  // file uploads
  await t
    .typeText(fileUploads.editor, '\nPlease consider this for publication')
    .setFilesToUpload(fileUploads.manuscriptUpload, manuscript.file)
    // wait for editor onChange
    .wait(1000)
    // manuscript preview page
    .click(fileUploads.preview)
    .expect(Selector('.sc-title-group').textContent)
    .eql(manuscript.title)
  // only way to get back to wizard is with browser back button at the moment
  await goBack()
  await t.click(wizardStep.next)

  // metadata
  await t
    .expect(metadata.title.value)
    .eql(manuscript.title)
    .click(metadata.articleType)
    .click(metadata.articleTypes.nth(0))
    .click(metadata.subjectAreaLabel)
    .pressKey('enter')
    .pressKey('down')
    .pressKey('enter')
    .click(metadata.discussionCheckbox)
    .typeText(metadata.discussionText, 'Spoke to Bob about another article')
    .click(metadata.previousArticleCheckbox)
    .typeText(metadata.previousArticleText, 'A title')
    .click(metadata.cosubmissionCheckbox)
    .typeText(metadata.firstCosubmissionTitle, 'Another title')
    .click(metadata.moreSubmission)
    .typeText(metadata.secondCosubmissionTitle, 'Yet another title')
    .click(wizardStep.next)
    .click(wizardStep.next)

  // reviewer suggestions
  await t
    .click(suggestions.suggestedSeniorEditorSelection)
    .click(suggestions.peoplePickerOptions.nth(0))
    .click(suggestions.peoplePickerOptions.nth(2))
    .click(suggestions.peoplePickerSubmit)
    .click(suggestions.suggestedReviewingEditorSelection)
    .click(suggestions.peoplePickerOptions.nth(1))
    .click(suggestions.peoplePickerOptions.nth(4))
    .click(suggestions.peoplePickerSubmit)
    .typeText(suggestions.firstReviewerName, 'Edward')
    .typeText(suggestions.firstReviewerEmail, 'edward@example.com')
    .typeText(suggestions.secondReviewerName, 'Frances')
    .typeText(suggestions.secondReviewerEmail, 'frances@example.net')
    .typeText(suggestions.thirdReviewerName, 'George')
    .typeText(suggestions.thirdReviewerEmail, 'george@example.org')
    .typeText(suggestions.fourthReviewerName, 'Ayesha')
    .typeText(suggestions.fourthReviewerEmail, 'ayesha@example.com')
    .typeText(suggestions.fifthReviewerName, 'Sneha')
    .typeText(suggestions.fifthReviewerEmail, 'sneha@example.net')
    .typeText(suggestions.sixthReviewerName, 'Emily')
    .typeText(suggestions.sixthReviewerEmail, 'emily@example.org')
    .click(suggestions.conflictOfInterest)
    .click(wizardStep.next)

  // data disclosure
  await t
    .typeText(disclosure.submitterName, 'Joe Bloggs')
    .click(disclosure.consentCheckbox)
    .click(wizardStep.next)

  // dashboard
  await t
    .expect(dashboard.titles.textContent)
    .eql(manuscript.title)
    .expect(dashboard.stages.textContent)
    .eql('QA')
})

test('Ability to progress through the wizard is tied to validation', async t => {
  replaySetup('success')
  await dashboard.login()
  await t.navigateTo(authorDetails.url)

  // set author details
  await t
    .typeText(authorDetails.firstNameField, 'Anne')
    .typeText(authorDetails.secondNameField, 'Author')
    .typeText(authorDetails.emailField, 'anne.author@life')
    .typeText(authorDetails.institutionField, 'University of eLife')
    .expect(Selector(authorDetails.emailValidationMessage).textContent)
    .eql(
      'Must be a valid email address',
      'Error is displayed when user enters invalid email',
    )
    .click(wizardStep.next)
    // without this wait the tests sometimes fail on CI ¯\_(ツ)_/¯
    .wait(1000)
    .expect(getPageUrl())
    .eql(
      authorDetails.url,
      'Validation errors prevent progress to the next page',
    )
    .typeText(authorDetails.emailField, '.ac.uk')
    .click(wizardStep.next)
    .expect(getPageUrl())
    .eql(
      fileUploads.url,
      'Entering valid inputs enables progress to the next page',
    )
})

test('Form entries are saved when a user navigates to the next page of the wizard', async t => {
  await dashboard.login()
  await t.navigateTo(authorDetails.url)

  await t
    .typeText(authorDetails.firstNameField, 'Meghan')
    .typeText(authorDetails.secondNameField, 'Moggy')
    .typeText(authorDetails.emailField, 'meghan@example.com')
    .typeText(authorDetails.institutionField, 'iTunes U')
    .click(wizardStep.next)

  // ensure save completed before reloading
  await fileUploads.editor
  await t.click(wizardStep.back)

  await t
    .expect(authorDetails.firstNameField.value)
    .eql('Meghan', 'First name has been saved')
    .expect(authorDetails.secondNameField.value)
    .eql('Moggy', 'Second name has been saved')
    .expect(authorDetails.emailField.value)
    .eql('meghan@example.com', 'Email has been saved')
    .expect(authorDetails.institutionField.value)
    .eql('iTunes U', 'Institution has been saved')
})
