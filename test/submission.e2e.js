import replay from 'replay'
import { Selector } from 'testcafe'
import { dashboard, authorDetails } from './pageObjects'
import authenticateFixture from './helpers/authenticate-fixture'

replay.fixtures = `${__dirname}/http-mocks`

const f = fixture('Submission')
authenticateFixture(f)

test('Happy path', async t => {
  // fake login by navigating to site and injecting token into local storage
  await t.navigateTo(dashboard.url)
  await t.ctx.localStorageSet(t.ctx.token)

  await t.navigateTo(dashboard.url).click('[data-test-id=submit]')

  // author details
  await t
    .typeText(authorDetails.firstNameField, 'Anne', {
      replace: true,
    })
    .typeText(authorDetails.secondNameField, 'Author', {
      replace: true,
    })
    .typeText(authorDetails.emailField, 'anne.author@life.ac.uk', {
      replace: true,
    })
    .typeText(authorDetails.institutionField, 'University of Life', {
      replace: true,
    })
    .click('[name=cbNotCorrespondingAuthor]')

  // correspondent details
  await t
    .typeText('[name=submissionMeta\\.correspondent\\.firstName]', 'A')
    .typeText('[name=submissionMeta\\.correspondent\\.lastName]', 'Signee')
    .typeText(
      '[name=submissionMeta\\.correspondent\\.email]',
      'a.signee@knocks.ac.uk',
    )
    .typeText(
      '[name=submissionMeta\\.correspondent\\.institution]',
      'University of Hard Knocks',
    )
    .click('[data-test-id=next]')

  // file uploads
  await t
    .setFilesToUpload(
      '[data-test-id=upload]>input',
      './fixtures/dummy-manuscript.docx',
    )
    .click('[data-test-id=next]')

  // metadata
  await t
    .typeText(
      '[name=title]',
      'Inferring multi-scale neural mechanisms with brain networking modelling',
    )
    .click('[role=listbox] button')
    .click(Selector('[role=option]').nth(0))
    .click('[name="metadata.discussedPreviously"]')
    .typeText(
      '[name="metadata.discussion"]',
      'Spoke to Bob about another article',
    )
    .click('[name="metadata.consideredPreviously"]')
    .typeText('[name="metadata.previousArticle"]', '01234')
    .click('[name="metadata.cosubmission"]')
    .typeText('[name="metadata.cosubmissionTitle"]', '56789')
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
    .click(Selector('[name=declaration]').parent())
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
