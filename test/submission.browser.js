import { ClientFunction, Selector } from 'testcafe'
import config from 'config'
import assert from 'assert'
import logger from '@pubsweet/logger'
import startSshServer from '@elifesciences/xpub-meca-export/test/mock-sftp-server'
import {
  author,
  dashboard,
  disclosure,
  editors,
  files,
  login,
  submission,
  thankyou,
  wizardStep,
} from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'

const f = fixture('Submission')
setFixtureHooks(f)

const manuscript = {
  title: 'The Relationship Between Lamport Clocks and Interrupts Using Obi',
  file: './fixtures/dummy-manuscript-2.pdf',
}

const getPageUrl = ClientFunction(() => window.location.href)
const autoRetry = async (fn, timeout = 5000) => {
  const delay = 100
  const start = Date.now()
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await fn()
    } catch (err) {
      if (Date.now() > start + timeout) {
        throw err
      }
      logger.debug(`Auto retrying failed assertion:`, err.message || err.errMsg)
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => setTimeout(resolve, delay))
  }
}

test('Happy path', async t => {
  const { mockFs, server } = await startSshServer(
    config.get('meca.sftp.connectionOptions.port'),
  )

  await t
    .navigateTo(login.url)
    .click(login.button)
    .click(dashboard.desktopNewSubmission)

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
    .eql('Tamlyn')
    .expect(author.secondNameField.value)
    .eql('Rhodes')
    // .expect(author.emailField.value)
    // .eql('f72c502e0d657f363b5f2dc79dd8ceea')
    // .expect(author.institutionField.value)
    // .eql('Tech team, University of eLife')
    .selectText(author.emailField)
    .typeText(author.emailField, 'example@example.org')
    .click(wizardStep.next)

  // uploading files - manuscript and cover letter
  await t
    .typeText(files.editor, '\nPlease consider this for publication')
    .setFilesToUpload(files.manuscriptUpload, manuscript.file)
    // wait for editor onChange
    .wait(1000)
    .click(wizardStep.next)

  // adding manuscript metadata
  await t
    .expect(submission.title.value)
    .eql(manuscript.title)
    .click(submission.articleType)
    .click(submission.articleTypes.nth(0))
    .click(submission.subjectAreaLabel)
    .pressKey('enter')
    .pressKey('down')
    .pressKey('enter')
    .click(submission.discussionCheckbox)
    .typeText(submission.discussionText, 'Spoke to Bob about another article')
    .click(submission.previousArticleCheckbox)
    .typeText(submission.previousArticleText, 'A title')
    .click(submission.cosubmissionCheckbox)
    .typeText(submission.firstCosubmissionTitle, 'Another title')
    .click(submission.moreSubmission)
    .typeText(submission.secondCosubmissionTitle, 'Yet another title')
    .click(wizardStep.next)

  // selecting suggested and excluded editors & reviewers
  await t
    .click(editors.suggestedSeniorEditorSelection)
    .click(editors.personPodInfoButtons.nth(0))
    .click(editors.cancelInfoModal)
    .click(editors.personInfoModal.nth(1))
    .click(editors.addPersonFromModal)
    .click(editors.peoplePickerOptions.nth(1))
    .click(editors.peoplePickerOptions.nth(0))
    // click on info button on selected person pod
    // click on 'remove editor'
    // assert editor has been removed
    .click(editors.peoplePickerOptions.nth(2))
    .click(editors.peoplePickerOptions.nth(3))
    .click(editors.peoplePickerOptions.nth(5))
    .click(editors.peoplePickerOptions.nth(7))
    .click(editors.peoplePickerOptions.nth(9))
    .click(editors.peoplePickerSubmit)
    // click on info button on one suggested senior editor pod
    // remove editor from control
    .click(editors.suggestedReviewingEditorSelection)
    .click(editors.peoplePickerOptions.nth(1))
    .click(editors.peoplePickerOptions.nth(4))
    .click(editors.peoplePickerOptions.nth(6))
    .click(editors.peoplePickerOptions.nth(8))
    .click(editors.peoplePickerOptions.nth(10))
    .click(editors.peoplePickerOptions.nth(11))
    .click(editors.peoplePickerSubmit)
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
    .click(editors.conflictOfInterest)
    .click(wizardStep.next)

  // consenting to data disclosure
  await t
    .typeText(disclosure.submitterName, 'Joe Bloggs')
    .click(disclosure.consentCheckbox)
    .click(wizardStep.submit)
    .click(wizardStep.accept)

  // thank you page
  await t.click(thankyou.finish)

  // dashboard
  await t
    .expect(dashboard.titles.textContent)
    .eql(manuscript.title)
    .expect(dashboard.statuses.textContent)
    // TODO this might cause a race condition
    .eql('Submitted')

  // SFTP server
  await autoRetry(() => {
    const dir = mockFs.readdirSync('/test')
    assert.strictEqual(dir[0].substring(36), '-meca.zip')
  })
  await new Promise((resolve, reject) =>
    server.close(err => (err ? reject(err) : resolve())),
  )
})

test('Ability to progress through the wizard is tied to validation', async t => {
  await t
    .navigateTo(login.url)
    .click(login.button)
    .click(dashboard.desktopNewSubmission)

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
    .match(author.url, 'Validation errors prevent progress to the next page')
    .typeText(author.emailField, '.ac.uk')
    .click(wizardStep.next)
    .expect(getPageUrl())
    .match(files.url, 'Entering valid inputs enables progress to the next page')
})

test('Form entries are saved when a user navigates to the next page of the wizard', async t => {
  await t
    .navigateTo(login.url)
    .click(login.button)
    .click(dashboard.desktopNewSubmission)

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
