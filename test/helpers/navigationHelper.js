import { Selector } from 'testcafe'
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
  redirect,
  cookie,
} from '../pageObjects'

const DEFAULT_TIMEOUT = 5000
const FILE_TIMEOUT = 60000
const OPTS = { timeout: DEFAULT_TIMEOUT }

class NavigationHelper {
  constructor(t) {
    this.t = t
  }

  async navigateForward() {
    await this.t.click(wizardStep.next, OPTS)
  }

  async navigateBack() {
    await this.t.click(wizardStep.back, OPTS)
  }

  async wait(time) {
    await this.t.wait(time)
  }

  async startAtRedirect() {
    await this.t.navigateTo(redirect.url).click(redirect.button, OPTS)

    if (Selector(cookie.button)) {
      await this.t.click(Selector(cookie.button, OPTS))
    }
    await this.wait(1000)
  }

  async login() {
    await this.t.navigateTo(login.url).click(login.button, OPTS)

    if (Selector(cookie.button)) {
      await this.t.click(Selector(cookie.button, OPTS))
    }
  }

  async openProfile() {
    await this.t.click(profile.open)
  }

  async newSubmission() {
    await this.t.click(dashboard.desktopNewSubmission)
  }

  async preFillAuthorDetailsWithOrcid() {
    await this.t.click(author.orcidPrefill)
  }

  async setAuthorName(name) {
    await this.t
      .selectText(author.firstNameField)
      .typeText(author.firstNameField, name)
  }

  async setAuthorSurname(surname) {
    await this.t
      .selectText(author.secondNameField)
      .typeText(author.secondNameField, surname)
  }

  async setAuthorEmail(email) {
    await this.t
      .selectText(author.emailField)
      .typeText(author.emailField, email)
  }

  async setAuthorInstitution(institution) {
    await this.t
      .selectText(author.institutionField)
      .typeText(author.institutionField, institution)
  }

  async fillCoverletter(text) {
    await this.t.typeText(files.editor, text)
  }

  async uploadManuscript(manuscript) {
    await this.t
      .setFilesToUpload(files.manuscriptUpload, manuscript.file)
      .expect(files.dropzoneMessage.textContent)
      .contains('Replace', { timeout: FILE_TIMEOUT })
  }

  async uploadSupportingFiles(supportingFiles) {
    await this.t.setFilesToUpload(files.supportingFilesUpload, supportingFiles)
  }

  async addManuscriptMetadata() {
    await this.t
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
  }

  async openEditorsPicker() {
    await this.t.click(editors.suggestedSeniorEditorSelection)
  }

  async openReviewerPicker() {
    await this.t.click(editors.suggestedReviewingEditorSelection)
  }

  async closePeoplePicker() {
    await this.t.click(editors.peoplePickerSubmit)
  }

  async selectPeople(people) {
    people.forEach(async person => {
      await this.t.click(editors.peoplePickerOptions.nth(person))
    })
  }

  async consentDisclosure() {
    await this.t
      .typeText(disclosure.submitterName, 'Joe Bloggs', OPTS)
      .click(disclosure.consentCheckbox, OPTS)
  }

  async waitForElement(name) {
    await this.t.expect(Selector(`[data-test-id="${name}"]`, OPTS))
  }

  async submit() {
    await this.t.click(wizardStep.submit, OPTS)
    // wait for "accept" button to show
    await this.waitForElement('accept')
  }

  async accept() {
    await this.t.click(wizardStep.accept, OPTS)
    // wait for "finish" button to show
    await this.waitForElement('finish')
  }

  async thankyou() {
    await this.t.click(thankyou.finish, OPTS)
    // wait for "desktop-new-submission" button to show
    await this.waitForElement('desktop-new-submission')
  }

  async paricialSubmissionThankyou(manuscript) {
    this.login()
    this.newSubmission()

    // author's page
    this.preFillAuthorDetailsWithOrcid()
    this.setAuthorEmail('example@example.org')
    this.navigateForward()

    // files' page
    this.fillCoverletter('\nPlease consider this for publication')
    this.uploadManuscript(manuscript)
    this.wait(1000)
    this.navigateForward()

    // submission metadata
    this.addManuscriptMetadata()
    this.navigateForward()

    // editor's page
    this.openEditorsPicker()
    this.selectPeople([0, 2, 3])
    this.closePeoplePicker()

    this.openReviewerPicker()
    this.selectPeople([1, 4, 6])
    this.closePeoplePicker()

    await this.t
      .typeText(editors.firstReviewerName, 'Edward')
      .typeText(editors.firstReviewerEmail, 'edward@example.com')
      .typeText(editors.secondReviewerName, 'Frances')
      .typeText(editors.secondReviewerEmail, 'frances@example.net')
      .typeText(editors.thirdReviewerName, 'George')
      .typeText(editors.thirdReviewerEmail, 'george@example.org')
    this.navigateForward()
  }

  async fullSubmission(manuscript) {
    await this.paricialSubmissionThankyou(manuscript)
    await this.consentDisclosure()
    await this.submit()
    await this.accept()
    await this.thankyou()
  }
}

export default NavigationHelper
