import { ClientFunction, Selector } from 'testcafe'
import {
  author,
  cookie,
  dashboard,
  editors,
  disclosure,
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

const getPageUrl = ClientFunction(() => window.location.href)

test('Persistence of form data', async t => {
  const navigationHelper = new NavigationHelper(t)
  await navigationHelper.skipToEditorsPage(manuscript)
  await navigationHelper.fillEditorsPage()
  await navigationHelper.navigateForward()
  await navigationHelper.navigateBack()
  await navigationHelper.reloadPage()
  await t.expect(editors.peoplePods.count).eql(6)
})

test('Happy path', async t => {
  const navigationHelper = new NavigationHelper(t)
  await navigationHelper.skipToDisclosurePage(manuscript)
  await navigationHelper.fillDisclosurePage()

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
  await navigationHelper.skipToAuthorPage()

  // set author details
  await navigationHelper.setAuthorName('Anne')
  await navigationHelper.setAuthorSurname('Author')
  await navigationHelper.setAuthorEmail('anne.author@life')
  await navigationHelper.setAuthorInstitution('University of eLife')
  await t
    .expect(Selector(author.emailValidationMessage).textContent)
    .eql(
      'Must be a valid email address',
      'Error is displayed when user enters invalid email',
    )

  await navigationHelper.navigateForward()

  await t
    .expect(getPageUrl())
    .match(author.url, 'Validation errors prevent progress to the next page')

  await navigationHelper.setAuthorEmail('anne.author@life.ac.uk')
  await navigationHelper.navigateForward()

  // File upload stage
  await t
    .expect(getPageUrl())
    .match(files.url, 'Entering valid inputs enables progress to the next page')

  await navigationHelper.navigateForward()
  await t
    .expect(getPageUrl())
    .match(files.url, 'Validation errors prevent progress to the next page')

  await navigationHelper.fillShortCoverletter() // dont need a long cover letter for this
  await navigationHelper.navigateForward()
  await t
    .expect(getPageUrl())
    .match(files.url, 'Entering valid inputs enables progress to the next page')

  await navigationHelper.uploadManuscript(manuscript)
  await navigationHelper.uploadSupportingFiles(manuscript.supportingFiles[0])
  await navigationHelper.navigateForward()

  // Submission metadata entry
  await t
    .expect(getPageUrl())
    .match(
      submission.url,
      'Entering valid inputs enables progress to the next page',
    )

  await navigationHelper.navigateForward()
  await t
    .expect(getPageUrl())
    .match(
      submission.url,
      'Validation errors prevent progress to the next page',
    )

  await navigationHelper.addManuscriptMetadata()
  await navigationHelper.navigateForward()
  // Editors
  await t
    .expect(getPageUrl())
    .match(
      editors.url,
      'Entering valid inputs enables progress to the next page',
    )

  await navigationHelper.navigateForward()

  await t
    .expect(getPageUrl())
    .match(editors.url, 'Validation errors prevent progress to the next page')

  await navigationHelper.openEditorsPicker()
  await navigationHelper.selectPeople([0, 2])
  await navigationHelper.closePeoplePicker()

  await navigationHelper.openReviewerPicker()
  await navigationHelper.selectPeople([1, 4])
  await navigationHelper.closePeoplePicker()

  await navigationHelper.navigateForward()

  // Disclosure
  await t
    .expect(getPageUrl())
    .match(
      disclosure.url,
      'Entering valid inputs enables progress to the next page',
    )

  await navigationHelper.submit()
  await t
    .expect(getPageUrl())
    .match(
      disclosure.url,
      'Validation errors prevent progress to the next page',
    )

  await t
    .expect((await disclosure.consentValidationWarning.textContent).length)
    .gt(0, 'is visible')

  await navigationHelper.consentDisclosure()
  await navigationHelper.submit()
  await navigationHelper.accept()
  await navigationHelper.thankyou()
})

test('Form entries are saved when a user navigates to the next page of the wizard', async t => {
  const navigationHelper = new NavigationHelper(t)

  await navigationHelper.login()
  await navigationHelper.newSubmission()

  await navigationHelper.setAuthorName('Meghan')
  await navigationHelper.setAuthorSurname('Moggy')
  await navigationHelper.setAuthorEmail('meghan@example.com')
  await navigationHelper.setAuthorInstitution('iTunes U')
  await navigationHelper.navigateForward()

  // ensure save completed before reloading
  await files.editor
  await navigationHelper.navigateBack()

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
  await navigationHelper.startAtRedirect()
  await t.expect(getPageUrl()).contains('/login')
})

test('Title entry box expands and shrinks for longer titles', async t => {
  const navigationHelper = new NavigationHelper(t)
  await navigationHelper.skipToDetailsPage(manuscript)

  // adding manuscript metadata
  await t
    .expect(
      Selector('textarea[data-test-id="manuscript-title-editor"]').getAttribute(
        'rows',
      ),
    )
    .eql('1')
  await navigationHelper.fillLongTitle()
  // The product defined max-height of the titlebox is 4 lines

  await t
    .expect(Selector('textarea[data-test-id="manuscript-title-editor"]').exists)
    .eql(true)
  await t
    .expect(
      Selector('textarea[data-test-id="manuscript-title-editor"]').getAttribute(
        'rows',
      ),
    )
    .eql('4')

  await navigationHelper.setTitle('A one line title')
  await t
    .expect(
      Selector('textarea[data-test-id="manuscript-title-editor"]').getAttribute(
        'rows',
      ),
    )
    .eql('1')
  // Change the title to something really long and then expect the rows prop of the textarea to increase
})

test('cookie notice', async t => {
  await t.navigateTo(login.url)
  await t.expect(cookie.button.exists).ok()
  await t.click(cookie.button)
  await t.expect(cookie.button.exists).notOk()
})
