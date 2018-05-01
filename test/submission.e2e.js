import replay from 'replay'
import { Selector, ClientFunction } from 'testcafe'
import { addUser } from '@pubsweet/db-manager'
import authentication from 'pubsweet-server/src/authentication'
import { startServer, setup, teardown } from './helpers/setup'
import { dashboard } from './pageObjects'

replay.fixtures = `${__dirname}/http-mocks`

const admin = {
  username: 'tester',
  email: 'tester@example.com',
  password: 'password',
  orcid: '0000-0001',
  admin: true,
}
let token

fixture('Submission')
  .before(startServer)
  .beforeEach(async () => {
    await setup()
    const user = await addUser(admin)
    token = authentication.token.create(user)
  })
  .afterEach(teardown)

const localStorageSet = ClientFunction((key, val) =>
  localStorage.setItem(key, val),
)

test('Happy path', async t => {
  // fake login by navigating to site and injecting token into local storage
  await t.navigateTo(dashboard.url)
  await localStorageSet('token', token)

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
