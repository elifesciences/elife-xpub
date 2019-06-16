import { Selector } from 'testcafe'
import { author, editors, files, submission, wizardStep } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'
import NavigationHelper from './helpers/navigationHelper'

const f = fixture('PeoplePicker')
setFixtureHooks(f)

const manuscript = {
  title: 'The Relationship Between Lamport Clocks and Interrupts Using Obi',
  file: './fixtures/dummy-manuscript-2.pdf',
}

test('People Picker', async t => {
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

  // author details pre-populated using Orcid API
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
  await t.click(editors.suggestedSeniorEditorSelection)
  await t.click(editors.peoplePickerOptions.nth(0))
  await t.click(editors.peoplePickerOptions.nth(2))
  await t.click(editors.peoplePickerOptions.nth(3))
  await t.click(editors.peoplePickerOptions.nth(5))
  await t.click(editors.peoplePickerOptions.nth(7))
  await t.click(editors.peoplePickerInfo.nth(9))

  // open modal, and we should be able to select this editor as maximun limit is not reach
  await t.expect(editors.peoplePickerModalErrorMaximum.count).eql(0)
  await t.click(Selector('[data-test-id="accept"]'))

  // limit of editors reach, we should get an error in the modal
  await t.click(editors.peoplePickerInfo.nth(10))
  await t.expect(editors.peoplePickerModalErrorMaximum.count).eql(1)
  await t.click(Selector('[data-test-id="cancel"]'))

  await t.wait(500)

  // click on an editor already added, it should display 'REMOVE EDITOR'
  await t.click(editors.peoplePickerInfo.nth(9))
  await t
    .expect(Selector('[data-test-id="accept"]').innerText)
    .eql('REMOVE EDITOR')
  await t.click(Selector('[data-test-id="accept"]'))

  await t.wait(500)

  // then we should be able to add a new editor
  await t.click(editors.peoplePickerInfo.nth(10))
  await t.expect(editors.peoplePickerModalErrorMaximum.count).eql(0)
  await t.click(Selector('[data-test-id="accept"]'))

  await t.click(editors.peoplePickerSubmit)
  await t.click(editors.suggestedReviewingEditorSelection)
  await t.click(editors.peoplePickerOptions.nth(1))
  await t.click(editors.peoplePickerOptions.nth(4))
  await t.click(editors.peoplePickerSubmit)
  await t.expect(editors.validationErrors.withText(/./).count).eql(0)
})
