import { Selector } from 'testcafe'
import config from 'config'
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
  profile,
} from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'

const f = fixture('Hotjar Suppression')
setFixtureHooks(f)

const manuscript = {
  title: 'The Relationship Between Lamport Clocks and Interrupts Using Obi',
  file: './fixtures/dummy-manuscript-2.pdf',
  supportingFiles: [
    './fixtures/dummy-supporting-1.pdf',
    './fixtures/dummy-supporting-2.docx',
  ],
}

test('test suppression is in place for the name', async t => {
  await t
    .navigateTo(login.url)
    .click(login.button)
    .wait(1000)
    .click(profile.open)
    .expect(profile.name, { 'data-hj-suppress': '' })
    .ok()
})

test('test suppression is in place for the coverletter', async t => {
  // fill author's page
  await t
    .navigateTo(login.url)
    .click(login.button)
    .click(dashboard.desktopNewSubmission)
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

  await t
    .expect(Selector('[data-test-id=coverletterEditor]'), {
      'data-hj-suppress': '',
    })
    .ok()
})

test('test disclousure is suppressing name', async t => {
  const { server } = await startSshServer(
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
    .setFilesToUpload(files.manuscriptUpload, manuscript.file)
    // wait for editor onChange
    .wait(1000)
    .setFilesToUpload(files.supportingFilesUpload, [
      manuscript.supportingFiles[0],
    ])
    .expect(files.supportingFile.count)
    .eql(1)
    .click(files.supportingFilesRemove)
    .setFilesToUpload(files.supportingFilesUpload, manuscript.supportingFiles)
    .expect(files.supportingFile.count)
    .eql(2)
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
    .click(editors.peoplePickerOptions.nth(0))
    .click(editors.peoplePickerOptions.nth(2))
    .click(editors.peoplePickerOptions.nth(3))
    .click(editors.peoplePickerOptions.nth(5))
    .click(editors.peoplePickerOptions.nth(7))
    .click(editors.peoplePickerOptions.nth(9))
    .click(editors.peoplePickerSubmit)
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
    .click(wizardStep.next)

  // consenting to data disclosure
  await t
    .typeText(disclosure.submitterName, 'Joe Bloggs')
    .expect(Selector('[data-test-id=disclosure-name]'), {
      'data-hj-suppress': '',
    })
    .ok()
    .click(disclosure.consentCheckbox)
    .click(wizardStep.submit)
    .click(wizardStep.accept)

  // thank you page
  await t.click(thankyou.finish)

  await new Promise((resolve, reject) =>
    server.close(err => (err ? reject(err) : resolve())),
  )
})
