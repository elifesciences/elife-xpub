import { ClientFunction, Selector } from 'testcafe'
import config from 'config'
import assert from 'assert'
import logger from '@pubsweet/logger'
import { startSshServer } from '@elifesciences/component-meca/'
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

  const navigationHelper = new NavigationHelper(t)
  await navigationHelper.login()
  await navigationHelper.newSubmission()

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

  await navigationHelper.preFillAuthorDetailsWithOrcid()
  await t
    .expect(author.firstNameField.value)
    .eql('Tamlyn')
    .expect(author.secondNameField.value)
    .eql('Rhodes')
    .expect(author.emailField.value)
    .eql('f72c502e0d657f363b5f2dc79dd8ceea')
    .expect(author.institutionField.value)
    .eql('Tech team, University of eLife')
  await navigationHelper.setAuthorEmail('example@example.org')
  await navigationHelper.navigateForward()

  // uploading files - manuscript and cover letter
  await navigationHelper.fillCoverletter('\nPlease consider this for publication')
  await navigationHelper.uploadManuscript(manuscript)
  await navigationHelper.uploadSupportingFiles(manuscript.supportingFiles[0])

  await t
    .expect(files.supportingFile.count)
    .eql(1)
    .click(files.supportingFilesRemove)

  await navigationHelper.uploadSupportingFiles(manuscript.supportingFiles)
  await t.expect(files.supportingFile.count).eql(2)

  // uploading supporting large files - should display an error
  await navigationHelper.uploadSupportingFiles(supportingFileLarge)
  await t
    .expect(files.supportingFile.count)
    .eql(3)
    .expect(files.supportingFileError.count)
    .eql(1)
  await navigationHelper.navigateForward()

  // adding manuscript metadata
  await t.expect(submission.title.value).eql(manuscript.title)
  await navigationHelper.addManuscriptMetadata()
  await navigationHelper.navigateForward()

  // selecting suggested and excluded editors & reviewers
  await navigationHelper.openEditorsPicker()
  await navigationHelper.selectPeople([0, 2])
  await navigationHelper.closePeoplePicker()

  await navigationHelper.openReviewerPicker()
  await navigationHelper.selectPeople([1, 4])
  await navigationHelper.closePeoplePicker()

  // await t
  //   .expect(editors.validationErrors.withText(/./).count)
  //   .eql(0)
  //   .typeText(editors.firstReviewerName, 'Edward')
  //   .typeText(editors.firstReviewerEmail, 'edward@example.com')
  //   .typeText(editors.secondReviewerName, 'Frances')
  //   .typeText(editors.secondReviewerEmail, 'frances@example.net')
  //   .typeText(editors.thirdReviewerName, 'George')
  //   .typeText(editors.thirdReviewerEmail, 'george@example.org')
  //   .typeText(editors.fourthReviewerName, 'Ayesha')
  //   .typeText(editors.fourthReviewerEmail, 'ayesha@example.com')
  //   .typeText(editors.fifthReviewerName, 'Sneha')
  //   .typeText(editors.fifthReviewerEmail, 'sneha@example.net')
  //   .typeText(editors.sixthReviewerName, 'Emily')
  //   .typeText(editors.sixthReviewerEmail, 'emily@example.org')

  await navigationHelper.navigateForward()

  // consenting to data disclosure
  await navigationHelper.consentDisclosure()
  await navigationHelper.submit()
  await navigationHelper.accept()
  await navigationHelper.thankyou()

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

