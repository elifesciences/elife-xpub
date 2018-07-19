import { ClientFunction, Selector } from 'testcafe'
import replaySetup from './helpers/replay-setup'
import {
  dashboard,
  submission,
  authorDetails,
  fileUploads,
  metadata,
  suggestions,
} from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'

const f = fixture('Submission')
setFixtureHooks(f)

const manuscript = {
  title: 'The Relationship Between Lamport Clocks and Interrupts Using Obi',
  file: './fixtures/dummy-manuscript-2.pdf',
}

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
    .click(submission.next)

  // file uploads
  await t
    .typeText(fileUploads.editor, '\nPlease consider this for publication')
    .setFilesToUpload(fileUploads.manuscriptUpload, manuscript.file)
    // wait for editor onChange
    .wait(1000)
    .click(submission.next)

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
    .click(submission.next)

  // reviewer suggestions
  await suggestions.fillWithDummyData()
  await t.click(suggestions.conflictOfInterest).click(submission.next)

  // dashboard
  await t
    .expect(dashboard.titles.textContent)
    .eql(manuscript.title)
    .expect(dashboard.stages.textContent)
    .eql('QA')
})

test('Corresponding author', async t => {
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
    .click(submission.next)
    // without this wait the tests sometimes fail on CI ¯\_(ツ)_/¯
    .wait(1000)
    .expect(ClientFunction(() => window.location.href)())
    .eql(
      authorDetails.url,
      'Validation errors prevent progress to the next page',
    )
    .typeText(authorDetails.emailField, '.ac.uk')
    .click(submission.next)

  // file uploads
  await t
    .typeText(fileUploads.editor, '\nPlease consider this for publication')
    .setFilesToUpload(fileUploads.manuscriptUpload, manuscript.file)
    // wait for editor onChange
    .wait(1000)

    .click(fileUploads.preview)
    .expect(Selector('.sc-title-group').textContent)
    .eql(manuscript.title)

  const goBack = ClientFunction(() => window.history.back())
  await goBack()
  await t.click(submission.next)

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
    .typeText(metadata.previousArticleText, '01234')
    .click(metadata.cosubmissionCheckbox)
    .typeText(metadata.firstCosubmissionTitle, '56789')
    .click(metadata.moreSubmission)
    .typeText(metadata.secondCosubmissionTitle, 'ABCDE')
    .click(submission.next)

  // reviewer suggestions
  await suggestions.fillWithDummyData()
  await t.click(suggestions.conflictOfInterest).click(submission.next)

  // dashboard
  await t
    .expect(dashboard.titles.textContent)
    .eql(manuscript.title)
    .expect(dashboard.stages.textContent)
    .eql('QA')
})

test('Submission form details are saved to server on submit', async t => {
  await dashboard.login()
  await t.navigateTo(authorDetails.url)

  await t
    .typeText(authorDetails.firstNameField, 'Meghan')
    .typeText(authorDetails.secondNameField, 'Moggy')
    .typeText(authorDetails.emailField, 'meghan@example.com')
    .typeText(authorDetails.institutionField, 'iTunes U')
    .click(submission.next)

  // ensure save completed before reloading
  await fileUploads.editor
  await t.navigateTo(authorDetails.url)

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
