import { author, dashboard, login, wizardStep, files } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'

const f = fixture('Submission')
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

  // create a new submission
  await t
    .click(author.orcidPrefill)
    .expect(author.firstNameField.value)
    .eql('Tamlyn')
    .expect(author.secondNameField.value)
    .eql('Rhodes')
    .expect(author.emailField.value)
    .eql('f72c502e0d657f363b5f2dc79dd8ceea')
    .expect(author.institutionField.value)
    .eql('Tech team, University of eLife')
    .selectText(author.emailField)
    .typeText(author.emailField, 'example@example.org')
    .click(wizardStep.next)

  // uploading files - manuscript and cover letter
  await t
    .typeText(files.editor, '\nPlease consider this for publication')
    // Test file type validation is working
    .setFilesToUpload(files.manuscriptUpload, unsupportedManuscriptFile.file)
    .wait(2000)
    .expect(files.dropzoneMessage.textContent)
    .contains('That file is not supported.')
    .setFilesToUpload(files.manuscriptUpload, manuscript.file)
    .expect(files.fileName.textContent)
    .eql(manuscript.fileName)
    // wait for editor onChange
    .wait(2000)
    .setFilesToUpload(files.manuscriptUpload, manuscriptReplacement.file)
    .wait(2000)
    .expect(files.fileName.textContent)
    .eql(manuscriptReplacement.fileName)
})
