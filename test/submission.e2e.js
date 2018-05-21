import { ClientFunction, Selector } from 'testcafe'
import replaySetup from './helpers/replay-setup'
import { dashboard, authorDetails } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'

const f = fixture('Submission')
setFixtureHooks(f)

test('Happy path', async t => {
  replaySetup('success')
  // fake login by navigating to site and injecting token into local storage
  await t.navigateTo(dashboard.url)
  await t.ctx.localStorageSet(t.ctx.token)
  await t.navigateTo(dashboard.url).click('[data-test-id=submit]')

  // author details pre-populated using Orcid API
  await t
    .expect(Selector(authorDetails.firstNameField).value)
    .eql('Test', 'First name is populated by query to the Orcid API')
    .expect(Selector(authorDetails.secondNameField).value)
    .eql('User', 'Last name is populated by query to the Orcid API')
    .expect(Selector(authorDetails.emailField).value)
    .eql('elife@mailinator.com', 'Email is populated by query to the Orcid API')
    .expect(Selector(authorDetails.institutionField).value)
    .eql(
      'University of eLife',
      'Institution is populated by query to the Orchid API',
    )

  // change author details
  await t
    .typeText(authorDetails.firstNameField, 'Anne', {
      replace: true,
    })
    .typeText(authorDetails.secondNameField, 'Author', {
      replace: true,
    })
    .typeText(authorDetails.emailField, 'anne.author@life', {
      replace: true,
    })
    .typeText(authorDetails.institutionField, 'University of Life', {
      replace: true,
    })
    .expect(Selector(authorDetails.emailValidationMessage).textContent)
    .eql(
      'Must be a valid email address',
      'Error is displayed when user enters invalid email',
    )
    .click('[data-test-id=next]')
    .wait(1000)
    .expect(ClientFunction(() => window.location.href)())
    .eql(
      authorDetails.url,
      'Validation errors prevent progress to the next page',
    )
    .typeText(authorDetails.emailField, 'ac.uk')
    .click(Selector('[name=cbNotCorrespondingAuthor]').parent())

  // correspondent details
  await t
    .typeText('[name="submissionMeta.correspondent.firstName"]', 'A')
    .typeText('[name="submissionMeta.correspondent.lastName"]', 'Signee')
    .typeText(
      '[name="submissionMeta.correspondent.email"]',
      'a.signee@knocks.ac.uk',
    )
    .typeText(
      '[name="submissionMeta.correspondent.institution"]',
      'University of Hard Knocks',
    )
    .click('[data-test-id=next]')

  // file uploads
  await t
    .typeText(
      '[name=coverLetter] div[contenteditable=true]',
      'Please consider this for publication',
    )
    .setFilesToUpload(
      '[data-test-id=upload]>input',
      './fixtures/dummy-manuscript.docx',
    )
    // wait for editor onChange
    .wait(1000)
    .click('[data-test-id=next]')

  // metadata
  await t
    .typeText(
      '[name=title]',
      'Inferring multi-scale neural mechanisms with brain networking modelling',
    )
    .click('[role=listbox] button')
    .click(Selector('[role=option]').nth(0))
    .click(Selector('[name="submissionMeta.discussedPreviously"]').parent())
    .typeText(
      '[name="submissionMeta.discussion"]',
      'Spoke to Bob about another article',
    )
    .click(Selector('[name="submissionMeta.consideredPreviously"]').parent())
    .typeText('[name="submissionMeta.previousArticle"]', '01234')
    .click(Selector('[name="submissionMeta.cosubmission"]').parent())
    .typeText('[name="submissionMeta.cosubmissionTitle"]', '56789')
    .click('[data-test-id=next]')

  // reviewer suggestions
  await t
    .typeText('[name="suggestedSeniorEditors.0"]', 'Sen Yor')
    .typeText('[name="suggestedSeniorEditors.1"]', 'Eddie Tar')
    .typeText('[name="suggestedReviewingEditors.0"]', 'Rev. Ewing')
    .typeText('[name="suggestedReviewingEditors.1"]', 'Ed Eater')
    .typeText('[name="suggestedReviewers.0.name"]', 'Si Entist')
    .typeText('[name="suggestedReviewers.0.email"]', 'si.entist@example.com')
    .typeText('[name="suggestedReviewers.1.name"]', 'Reece Archer')
    .typeText('[name="suggestedReviewers.1.email"]', 'reece@example.net')
    .typeText('[name="suggestedReviewers.2.name"]', 'Dave')
    .typeText('[name="suggestedReviewers.2.email"]', 'dave@example.org')
    .click(Selector('[name=noConflictOfInterest]').parent())
    .click('[data-test-id=next]')
})

test('Submission form details are saved to server on submit', async t => {
  await t.navigateTo(dashboard.url)
  await t.ctx.localStorageSet(t.ctx.token)

  await t.navigateTo(dashboard.url).click('[data-test-id=submit]')

  await t
    .typeText(authorDetails.firstNameField, 'Meghan', {
      replace: true,
    })
    .typeText(authorDetails.secondNameField, 'Moggy', {
      replace: true,
    })
    .typeText(authorDetails.emailField, 'meghan.moggy@life.ac.uk', {
      replace: true,
    })
    .typeText(authorDetails.institutionField, 'iTunes U', { replace: true })
    .click('[data-test-id=next]')

  await t.navigateTo(authorDetails.url)
  await t
    .expect(Selector(authorDetails.firstNameField).value)
    .eql('Meghan', 'First name has been saved')
    .expect(Selector(authorDetails.secondNameField).value)
    .eql('Moggy', 'Second name has been saved')
    .expect(Selector(authorDetails.emailField).value)
    .eql('meghan.moggy@life.ac.uk', 'Email has been saved')
    .expect(Selector(authorDetails.institutionField).value)
    .eql('iTunes U', 'Institution has been saved')
})

const noManuscriptError = 'Please upload your Manuscript.'
const badManuscriptError =
  'Network error: Response not successful: Received status code 400'
const manuscriptUploadSuccess = 'Success! Preview or replace your Manuscript.'

test('Clicking next without uploading manuscript on page 2 generates error', async t => {
  await t.navigateTo(dashboard.url)
  await t.ctx.localStorageSet(t.ctx.token)
  await t.navigateTo(dashboard.url).click('[data-test-id=submit]')

  await t.click('[data-test-id=next]')
  await t.click('[data-test-id=next]')
  await t
    .expect(Selector('[name=dropzoneMessage]').innerText)
    .eql(noManuscriptError)
})

test('Uploading the wrong type of file for manuscript will show error', async t => {
  await t.navigateTo(dashboard.url)
  await t.ctx.localStorageSet(t.ctx.token)
  await t.navigateTo(dashboard.url).click('[data-test-id=submit]')

  await t.click('[data-test-id=next]')

  await t
    .setFilesToUpload(
      '[data-test-id=upload]>input',
      './fixtures/dummy-manuscript.pdf',
    )
    .then(arg => {
      throw new Error('No error was thrown when uploading bad manuscript type')
    })
    .catch(e => {
      if (e.errMsg !== badManuscriptError) throw e
    })
})

test('Uploading a correct file for manuscript shows success', async t => {
  await t.navigateTo(dashboard.url)
  await t.ctx.localStorageSet(t.ctx.token)
  await t.navigateTo(dashboard.url).click('[data-test-id=submit]')

  await t.click('[data-test-id=next]')
  await t
    .setFilesToUpload(
      '[data-test-id=upload]>input',
      './fixtures/dummy-manuscript.docx',
    )
    .wait(1000)
    .expect(Selector('[name=dropzoneMessage]').innerText)
    .eql(manuscriptUploadSuccess)
})

test('Uploading a correct file for manuscript after no-manuscript error shows success', async t => {
  await t.navigateTo(dashboard.url)
  await t.ctx.localStorageSet(t.ctx.token)
  await t.navigateTo(dashboard.url).click('[data-test-id=submit]')

  await t.click('[data-test-id=next]')
  await t.click('[data-test-id=next]')
  await t
    .setFilesToUpload(
      '[data-test-id=upload]>input',
      './fixtures/dummy-manuscript.docx',
    )
    .wait(1000)
    .expect(Selector('[name=dropzoneMessage]').innerText)
    .eql(manuscriptUploadSuccess)
})

test('Uploading correct manuscript type after uploading wrong manuscript type shows success', async t => {
  await t.navigateTo(dashboard.url)
  await t.ctx.localStorageSet(t.ctx.token)
  await t.navigateTo(dashboard.url).click('[data-test-id=submit]')

  await t.click('[data-test-id=next]')
  await t
    .setFilesToUpload('[data-test-id=upload]>input', [
      './fixtures/dummy-manuscript.pdf',
      './fixtures/dummy-manuscript.docx',
    ])
    .wait(1000)
    .expect(Selector('[name=dropzoneMessage]').innerText)
    .eql(manuscriptUploadSuccess)
})

test('Reuploading manuscript after success shows success again', async t => {
  await t.navigateTo(dashboard.url)
  await t.ctx.localStorageSet(t.ctx.token)
  await t.navigateTo(dashboard.url).click('[data-test-id=submit]')

  await t.click('[data-test-id=next]')
  await t
    .setFilesToUpload('[data-test-id=upload]>input', [
      './fixtures/dummy-manuscript.docx',
      './fixtures/dummy-manuscript.docx',
    ])
    .wait(1000)
    .expect(Selector('[name=dropzoneMessage]').innerText)
    .eql(manuscriptUploadSuccess)
})

test.skip('Preview a manuscript works', async t => {
  /* TODO */
})
