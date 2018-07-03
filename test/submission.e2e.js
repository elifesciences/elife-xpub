import { ClientFunction, Selector } from 'testcafe'
import replaySetup from './helpers/replay-setup'
import { dashboard, authorDetails, fileUploads } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'

const f = fixture('Submission')
setFixtureHooks(f)

const manuscript = {
  title: 'The Relationship Between Lamport Clocks and Interrupts Using Obi',
  file: './fixtures/dummy-manuscript-2.pdf',
}

test('Happy path', async t => {
  replaySetup('success')
  // fake login by navigating to site and injecting token into local storage
  await t.navigateTo(dashboard.url)
  await t.ctx.localStorageSet(t.ctx.token)
  await t.navigateTo(dashboard.url).click('[data-test-id=submit]')

  // author details initially empty
  await t
    .expect(authorDetails.firstNameField.value)
    .eql('')
    .expect(authorDetails.secondNameField.value)
    .eql('')
    .expect(authorDetails.emailField.value)
    .eql('')
    .expect(authorDetails.institutionField.value)
    .eql('')

  // author details pre-populated using Orcid API
  await t
    .click(authorDetails.orcidPrefill)
    .expect(authorDetails.firstNameField.value)
    .eql('Test', 'First name is populated by query to the Orcid API')
    .expect(authorDetails.secondNameField.value)
    .eql('User', 'Last name is populated by query to the Orcid API')
    .expect(authorDetails.emailField.value)
    .eql('elife@mailinator.com', 'Email is populated by query to the Orcid API')
    .expect(authorDetails.institutionField.value)
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
    .expect(ClientFunction(() => window.location.href)())
    .eql(
      authorDetails.url,
      'Validation errors prevent progress to the next page',
    )
    .typeText(authorDetails.emailField, '.ac.uk')

    .click('[data-test-id=next]')

  // file uploads
  await t
    .typeText(fileUploads.editor, '\nPlease consider this for publication')
    .setFilesToUpload(fileUploads.manuscriptUpload, manuscript.file)
    // wait for editor onChange
    .wait(1000)

    .click('[data-test-id=preview')
    .expect(Selector('.sc-title-group').textContent)
    .eql('The Relationship Between Lamport Clocks and Interrupts Using Obi')

  const goBack = ClientFunction(() => window.history.back())
  await goBack()
  await t.click('[data-test-id=next]')

  // metadata
  await t
    .expect(Selector('[name=title]').value)
    .eql(manuscript.title)
    .click('[role=listbox] button')
    .click(Selector('[role=option]').nth(0))
    .click(Selector('label[for=subject-area-select'))
    .pressKey('enter')
    .pressKey('down')
    .pressKey('enter')
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

  // dashboard
  await t
    .expect(Selector('[data-test-id=title]').textContent)
    .eql(manuscript.title)
    .expect(Selector('[data-test-id=stage]').textContent)
    .eql('QA')
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

  // ensure save completed before reloading
  await fileUploads.editor
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
