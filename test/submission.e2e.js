import { ClientFunction, Selector } from 'testcafe'
import replaySetup from './helpers/replay-setup'
import {
  dashboard,
  wizardStep,
  author,
  files,
  metadata,
  editors,
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
    .expect(author.firstNameField.value)
    .eql('')
    .expect(author.secondNameField.value)
    .eql('')
    .expect(author.emailField.value)
    .eql('')
    .expect(author.institutionField.value)
    .eql('')

  // author details pre-populated using Orcid API
  await t
    .click(author.orcidPrefill)
    .expect(author.firstNameField.value)
    .eql('Test', 'First name is populated by query to the Orcid API')
    .expect(author.secondNameField.value)
    .eql('User', 'Last name is populated by query to the Orcid API')
    .expect(author.emailField.value)
    .eql('elife@mailinator.com', 'Email is populated by query to the Orcid API')
    .expect(author.institutionField.value)
    .eql(
      'University of eLife',
      'Institution is populated by query to the Orchid API',
    )
    .click(wizardStep.next)

  // uploading files - manuscript and cover letter
  await t
    .typeText(files.editor, '\nPlease consider this for publication')
    .setFilesToUpload(files.manuscriptUpload, manuscript.file)
    // wait for editor onChange
    .wait(1000)
    // manuscript preview page
    .click(files.preview)
    .expect(Selector('.sc-title-group').textContent)
    .eql(manuscript.title)
  // only way to get back to wizard is with browser back button at the moment
  await goBack()
  await t.click(wizardStep.next)

  // adding manuscript metadata
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

  // selecting suggested and excluded editors & reviewers
  await t
    .click(editors.suggestedSeniorEditorSelection)
    .click(editors.peoplePickerOptions.nth(0))
    .click(editors.peoplePickerOptions.nth(2))
    .click(editors.peoplePickerSubmit)
    .click(editors.suggestedReviewingEditorSelection)
    .click(editors.peoplePickerOptions.nth(1))
    .click(editors.peoplePickerOptions.nth(4))
    .click(editors.peoplePickerSubmit)
    .typeText(editors.firstReviewerName, 'Edward')
    .typeText(editors.firstReviewerEmail, 'edward@example.com')
    .typeText(editors.secondReviewerName, 'Frances')
    .typeText(editors.secondReviewerEmail, 'frances@example.net')
    .typeText(editors.thirdReviewerName, 'George')
    .typeText(editors.thirdReviewerEmail, 'george@example.org')
    .typeText(editors.fourthReviewerName, 'Ayesha')
    .typeText(editors.fourthReviewerEmail, 'ayesha@example.com')
    .typeText(editors.fifthReviewerName, 'Sneha')
    .typeText(editors.fifthReviewerEmail, 'sneha@example.net')
    .typeText(editors.sixthReviewerName, 'Emily')
    .typeText(editors.sixthReviewerEmail, 'emily@example.org')
    .click(editors.conflictOfInterest)
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
  await t.navigateTo(author.url)

  // set author details
  await t
    .typeText(author.firstNameField, 'Anne')
    .typeText(author.secondNameField, 'Author')
    .typeText(author.emailField, 'anne.author@life')
    .typeText(author.institutionField, 'University of eLife')
    .expect(Selector(author.emailValidationMessage).textContent)
    .eql(
      'Must be a valid email address',
      'Error is displayed when user enters invalid email',
    )
    .click(wizardStep.next)
    // without this wait the tests sometimes fail on CI ¯\_(ツ)_/¯
    .wait(1000)
    .expect(getPageUrl())
    .eql(author.url, 'Validation errors prevent progress to the next page')
    .typeText(author.emailField, '.ac.uk')
    .click(wizardStep.next)
    .expect(getPageUrl())
    .eql(files.url, 'Entering valid inputs enables progress to the next page')
})

test('Form entries are saved when a user navigates to the next page of the wizard', async t => {
  await dashboard.login()
  await t.navigateTo(author.url)

  await t
    .typeText(author.firstNameField, 'Meghan')
    .typeText(author.secondNameField, 'Moggy')
    .typeText(author.emailField, 'meghan@example.com')
    .typeText(author.institutionField, 'iTunes U')
    .click(wizardStep.next)

  // ensure save completed before reloading
  await files.editor
  await t.click(wizardStep.back)

  await t
    .expect(author.firstNameField.value)
    .eql('Meghan', 'First name has been saved')
    .expect(author.secondNameField.value)
    .eql('Moggy', 'Second name has been saved')
    .expect(author.emailField.value)
    .eql('meghan@example.com', 'Email has been saved')
    .expect(author.institutionField.value)
    .eql('iTunes U', 'Institution has been saved')
})
