import { ClientFunction, Selector } from 'testcafe'
import {
  author,
  dashboard,
  editors,
  files,
  submission,
  login,
} from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'
import NavigationHelper from './helpers/navigationHelper'

const f = fixture('Submission')
setFixtureHooks(f)

const manuscript = {
  title: 'The Relationship Between Lamport Clocks and Interrupts Using Obi',
  file: './fixtures/dummy-manuscript-2.pdf',
  supportingFiles: [
    './fixtures/dummy-supporting-1.pdf',
    './fixtures/dummy-supporting-2.docx',
  ],
}

const supportingFileLarge = './fixtures/dummy-pdf-test11MB.pdf'
const getPageUrl = ClientFunction(() => window.location.href)

test('Happy path', async t => {
  const navigationHelper = new NavigationHelper(t)
  navigationHelper.login()
  navigationHelper.newSubmission()

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

  navigationHelper.preFillAuthorDetailsWithOrcid()
  await t
    .expect(author.firstNameField.value)
    .eql('Aaron')
    .expect(author.secondNameField.value)
    .eql('Swartz')
    .expect(author.emailField.value)
    .eql('f72c502e0d657f363b5f2dc79dd8ceea')
    .expect(author.institutionField.value)
    .eql('Tech team, University of eLife')
  navigationHelper.setAuthorEmail('example@example.org')
  navigationHelper.navigateForward()

  // uploading files - manuscript and cover letter
  navigationHelper.fillCoverletter()
  navigationHelper.uploadManuscript(manuscript)
  navigationHelper.uploadSupportingFiles(manuscript.supportingFiles[0])

  await t
    .expect(files.supportingFile.count)
    .eql(1)
    .click(files.supportingFilesRemove, { timeout: 60000 })

  navigationHelper.uploadSupportingFiles(manuscript.supportingFiles)
  await t.expect(files.supportingFile.count).eql(2)

  // uploading supporting large files - should display an error
  navigationHelper.uploadSupportingFiles(supportingFileLarge)
  await t
    .expect(files.supportingFile.count)
    .eql(3)
    .expect(files.supportingFileError.count)
    .eql(1)
  await t.expect(files.manuscriptDownloadLink.hasAttribute('href')).eql(true)
  navigationHelper.navigateForward()

  // adding manuscript metadata
  await t.expect(submission.title.value).eql(manuscript.title)
  navigationHelper.addManuscriptMetadata()
  navigationHelper.navigateForward()

  // selecting suggested and excluded editors & reviewers
  navigationHelper.openEditorsPicker()
  navigationHelper.selectPeople([0, 2, 3, 5, 7, 9])
  navigationHelper.closePeoplePicker()

  navigationHelper.openReviewerPicker()
  navigationHelper.selectPeople([1, 4, 6, 8, 10, 11])
  navigationHelper.closePeoplePicker()

  await t
    .expect(editors.validationErrors.withText(/./).count)
    .eql(0)
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

  navigationHelper.navigateForward()

  // consenting to data disclosure
  navigationHelper.consentDisclosure()
  navigationHelper.submit()
  navigationHelper.accept()
  navigationHelper.thankyou()

  // dashboard
  await t
    .expect(dashboard.titles.textContent)
    .eql(manuscript.title)
    .expect(dashboard.statuses.textContent)
    // TODO this might cause a race condition
    .eql('Submitted')
})

test('Ability to progress through the wizard is tied to validation', async t => {
  const navigationHelper = new NavigationHelper(t)

  navigationHelper.login()
  navigationHelper.newSubmission()

  // set author details
  navigationHelper.setAuthorName('Anne')
  navigationHelper.setAuthorSurname('Author')
  navigationHelper.setAuthorEmail('anne.author@life')
  navigationHelper.setAuthorInstitution('University of eLife')
  await t
    .expect(Selector(author.emailValidationMessage).textContent)
    .eql(
      'Must be a valid email address',
      'Error is displayed when user enters invalid email',
    )

  navigationHelper.navigateForward()
  // without this wait the tests sometimes fail on CI ¯\_(ツ)_/¯
  navigationHelper.wait(2000)

  await t
    .expect(getPageUrl())
    .match(author.url, 'Validation errors prevent progress to the next page')

  navigationHelper.setAuthorEmail('anne.author@life.ac.uk')
  navigationHelper.navigateForward()
  await t
    .expect(getPageUrl())
    .match(files.url, 'Entering valid inputs enables progress to the next page')
})

test('Form entries are saved when a user navigates to the next page of the wizard', async t => {
  const navigationHelper = new NavigationHelper(t)

  await navigationHelper.login()
  navigationHelper.newSubmission()

  navigationHelper.setAuthorName('Meghan')
  navigationHelper.setAuthorSurname('Moggy')
  navigationHelper.setAuthorEmail('meghan@example.com')
  navigationHelper.setAuthorInstitution('iTunes U')
  navigationHelper.navigateForward()

  // ensure save completed before reloading
  await files.editor
  navigationHelper.navigateBack()

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

test('redirect page allows you to continue through app', async t => {
  const navigationHelper = new NavigationHelper(t)
  navigationHelper.startAtRedirect()
  await t.expect(getPageUrl()).contains('/login')
})

test('cookie notice', async t => {
  await t.navigateTo(login.url)
  await t.expect(Selector('[data-test-id="cookieAcceptButton"]').exists).ok()
  await t.click(Selector('[data-test-id="cookieAcceptButton"]'))
  await t.expect(Selector('[data-test-id="cookieAcceptButton"]').exists).notOk()
})
