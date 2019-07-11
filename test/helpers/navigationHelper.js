import { ClientFunction, Selector } from 'testcafe'
import {
  AuthorPage,
  DashboardPage,
  DisclosurePage,
  EditorsPage,
  FilesPage,
  login,
  SubmissionPage,
  wizardStep,
  profile,
  redirect,
  cookie,
} from '../pageObjects'

const DEFAULT_TIMEOUT = 5000
const OPTS = { timeout: DEFAULT_TIMEOUT }

class NavigationHelper {
  constructor(t) {
    this.t = t
    this.dashboardPage = new DashboardPage(t)
    this.authorPage = new AuthorPage(t)
    this.filesPage = new FilesPage(t)
    this.submissionPage = new SubmissionPage(t)
    this.editorsPage = new EditorsPage(t)
    this.disclosurePage = new DisclosurePage(t)
  }

  getDashboardPage() {
    return this.dashboardPage
  }

  getAuthorPage() {
    return this.authorPage
  }

  getFilesPage() {
    return this.filesPage
  }

  getSubmissionPage() {
    return this.submissionPage
  }

  getEditorsPage() {
    return this.editorsPage
  }

  getDisclosurePage() {
    return this.disclosurePage
  }

  async navigateForward() {
    await this.t.click(wizardStep.next, OPTS)
  }

  async navigateBack() {
    await this.t.click(wizardStep.back, OPTS)
  }

  async reloadPage() {
    // eslint-disable-next-line no-restricted-globals
    await this.t.eval(() => location.reload(true))
  }

  static async getURL() {
    const url = await ClientFunction(() => window.location.href)
    return url()
  }

  static async getSubmissionId() {
    const uuidRegEx = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const url = await this.getURL()
    const uuid = url.split('/')[4]
    await this.t.expect(uuid).Match(uuidRegEx, 'not a submission id')
    return uuid
  }

  async wait(time) {
    await this.t.wait(time)
  }

  async startAtRedirect() {
    await this.t.navigateTo(redirect.url).click(redirect.button, OPTS)
    await this.clearCookieNotification()
  }

  async clearCookieNotification() {
    const cookieNoticeExists = await Selector(cookie.button).exists
    if (cookieNoticeExists) {
      await this.t.click(Selector(cookie.button, OPTS))
    }
  }

  async login() {
    await this.t.navigateTo(login.url).click(login.button, OPTS)
    await this.clearCookieNotification()
  }

  async openProfile() {
    await this.t.click(profile.open)
  }

  waitForElement(name) {
    this.t.expect(Selector(`[data-test-id="${name}"]`, OPTS))
  }

  async fillAuthorPage(email) {
    await this.authorPage.preFillAuthorDetailsWithOrcid()
    await this.authorPage.setEmail(email)
  }

  async fillFilesPage(manuscript, shortCoverLetter = true) {
    if (shortCoverLetter) {
      await this.filesPage.writeShortCoverLetter()
    } else {
      await this.filesPage.writeLongCoverLetter()
    }
    await this.filesPage.uploadManuscript(manuscript)
  }

  async fillDetailsPage(minimal = true) {
    await this.submissionPage.writeTitleIfEmpty()
    await this.submissionPage.selectArticleType()
    await this.submissionPage.selectSubjectAreas()
    if (!minimal) {
      await this.submissionPage.setDiscussion()
      await this.submissionPage.setPreviousArticleCheckbox()
      await this.submissionPage.setCoSubmissionBox()
    }
  }

  async fillEditorsPage() {
    await this.editorsPage.selectSeniorEditors([1, 2])
    await this.editorsPage.selectSeniorReviewers([1, 2])
  }

  async fillDisclosurePage() {
    await this.disclosurePage.consentDisclosure()
    await this.disclosurePage.submit()
    await this.disclosurePage.accept()
    await this.disclosurePage.thankyou()
  }

  async skipToAuthorPage() {
    await this.login()
    await this.dashboardPage.startNewSubmission()
  }

  async skipToFilesPage() {
    await this.skipToAuthorPage()
    await this.fillAuthorPage()
    await this.navigateForward()
  }

  async skipToDetailsPage(manuscript, shortCoverLetter) {
    await this.skipToFilesPage()
    await this.fillFilesPage(manuscript, shortCoverLetter)
    await this.navigateForward()
  }

  async skipToEditorsPage(manuscript, shortCoverLetter, minimalDetails) {
    await this.skipToDetailsPage(manuscript, shortCoverLetter)
    await this.fillDetailsPage(minimalDetails)
    await this.navigateForward()
  }

  async skipToDisclosurePage(manuscript, shortCoverLetter, minimalDetails) {
    await this.skipToEditorsPage(manuscript, shortCoverLetter, minimalDetails)
    await this.fillEditorsPage()
    await this.navigateForward()
  }
}

export default NavigationHelper
