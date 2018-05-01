import replay from 'replay'
import { Selector } from 'testcafe'
import { dashboard } from './pageObjects'
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
    .typeText('[name=firstName]', 'Anne')
    .typeText('[name=lastName]', 'Author')
    .typeText('[name=email]', 'anne.author@life.ac.uk')
    .typeText('[name=institution]', 'University of Life')
    .click('[name=cbNotCorrespondingAuthor]')

  // assignee details
  await t
    .typeText('[name=assignee\\.firstName]', 'A')
    .typeText('[name=assignee\\.lastName]', 'Signee')
    .typeText('[name=assignee\\.email]', 'a.signee@knocks.ac.uk')
    .typeText('[name=assignee\\.institution]', 'University of Hard Knocks')
    .click('[data-test-id=next]')

  // file uploads
  await t
    .setFilesToUpload(
      '[data-test-id=upload]>input',
      './fixtures/dummy-manuscript.docx',
    )
    .click('[data-test-id=next]')

  // metadata
  await t.click('[data-test-id=next]')

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
