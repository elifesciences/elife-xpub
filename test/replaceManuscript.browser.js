import { author, wizardStep, files } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'
import NavigationHelper from './helpers/navigationHelper'

const f = fixture('Submission')
const FILE_TIMEOUT = 60000
setFixtureHooks(f)

const manuscript = {
  title: 'The Relationship Between Lamport Clocks and Interrupts Using Obi',
  file: './fixtures/dummy-manuscript.pdf',
  fileName: 'dummy-manuscript.pdf',
}

const unsupportedManuscriptFile = {
  title: 'Image',
  file: './fixtures/dummy-manuscript-3.png',
  fileName: 'dummy-manuscript-3.png',
}

const manuscriptReplacement = {
  title: 'The Relationship Between Lamport Clocks and Interrupts Using Obi',
  file: './fixtures/dummy-manuscript-2.pdf',
  fileName: 'dummy-manuscript-2.pdf',
}

test('Replace Manuscript on the Submission', async t => {
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

  // create a new submission
  await t
    .click(author.orcidPrefill)
    .expect(author.firstNameField.value)
    .eql('Aaron')
    .expect(author.secondNameField.value)
    .eql('Swartz')
    .expect(author.emailField.value)
    .eql('f72c502e0d657f363b5f2dc79dd8ceea')
    .expect(author.institutionField.value)
    .eql('Tech team, University of eLife')
    .selectText(author.emailField)
    .typeText(author.emailField, 'example@example.org')
    .click(wizardStep.next)

  // uploading files - manuscript and cover letter
  navigationHelper.fillCoverletter()
  await t
    // Test file type validation is working
    .setFilesToUpload(files.manuscriptUpload, unsupportedManuscriptFile.file)
    .expect(files.dropzoneMessage.textContent)
    .contains('That file is not supported.', { timeout: 5000 })
    .setFilesToUpload(files.manuscriptUpload, manuscript.file)
    .expect(files.dropzoneMessage.textContent)
    .contains('Replace', { timeout: FILE_TIMEOUT })
    .expect(files.fileName.textContent)
    .eql(manuscript.fileName)

  await t
    .setFilesToUpload(files.manuscriptUpload, manuscriptReplacement.file)
    .expect(files.dropzoneMessage.textContent)
    .contains('Replace', { timeout: FILE_TIMEOUT })
    .expect(files.fileName.textContent)
    .eql(manuscriptReplacement.fileName)
})
