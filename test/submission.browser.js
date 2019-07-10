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
  const authorPage = navigationHelper.getAuthorPage()
  const filesPage = navigationHelper.getFilesPage()
  await navigationHelper.skipToAuthorPage()

  // set author details
  await authorPage.setFirstName()
  await authorPage.setSurname()
  await authorPage.setEmail('anne.author@life')
  await authorPage.setInstitution()
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

  await authorPage.setEmail('anne.author@life.ac.uk')
  await navigationHelper.navigateForward()

  // File upload stage
  await t
    .expect(getPageUrl())
    .match(files.url, 'Entering valid inputs enables progress to the next page')

  await navigationHelper.navigateForward()
  await t
    .expect(getPageUrl())
    .match(files.url, 'Validation errors prevent progress to the next page')

  await filesPage.writeShortCoverLetter() // dont need a long cover letter for this
  await navigationHelper.navigateForward()
  await t
    .expect(getPageUrl())
    .match(files.url, 'Entering valid inputs enables progress to the next page')

  await filesPage.uploadManuscript(manuscript)
  await filesPage.uploadSupportingFiles(manuscript.supportingFiles[0])
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
  await navigationHelper.fillDetailsPage()
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

  const editorsPage = navigationHelper.getEditorsPage()
  await editorsPage.selectSeniorEditors([0, 2])
  await editorsPage.selectSeniorReviewers([1, 4])

  await navigationHelper.navigateForward()

  // Disclosure
  await t
    .expect(getPageUrl())
    .match(
      disclosure.url,
      'Entering valid inputs enables progress to the next page',
    )

  const disclosurePage = navigationHelper.getDisclosurePage()
  await disclosurePage.submit()
  await t
    .expect(getPageUrl())
    .match(
      disclosure.url,
      'Validation errors prevent progress to the next page',
    )

  await t
    .expect((await disclosure.consentValidationWarning.textContent).length)
    .gt(0, 'is visible')

  await disclosurePage.consentDisclosure()
  await disclosurePage.submit()
  await disclosurePage.accept()
  await disclosurePage.thankyou()
})

test('Form entries are saved when a user navigates to the next page of the wizard', async t => {
  const navigationHelper = new NavigationHelper(t)
  const authorPage = navigationHelper.getAuthorPage()

  await navigationHelper.skipToAuthorPage()

  await authorPage.setFirstName('Meghan')
  await authorPage.setSurname('Moggy')
  await authorPage.setEmail('meghan@example.com')
  await authorPage.setInstitution('iTunes U')
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
  const submissionPage = navigationHelper.getSubmissionPage()
  await navigationHelper.skipToDetailsPage(manuscript)

  // adding manuscript metadata
  await t
    .expect(
      Selector('textarea[data-test-id="manuscript-title-editor"]').getAttribute(
        'rows',
      ),
    )
    .eql('1')
  await submissionPage.writeTitle(submissionPage.longText)
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

  await submissionPage.writeTitle()
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
