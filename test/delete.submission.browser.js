import config from 'config'
import { Selector } from 'testcafe'
import { author, dashboard, login, wizardStep } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'

const f = fixture('DeleteSubmission')
setFixtureHooks(f)

test('Delete a Submission', async t => {
  console.log('Delete a submission start')
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

  // navigate back to the dashboard page and cancel the delete the submission
  await t
    .navigateTo(`${config.get('pubsweet-server.baseUrl')}`)
    .click(dashboard.trashButton)
    .click(Selector('[data-test-id=cancel'))
    .expect(dashboard.trashButton.count)
    .eql(1)

  // navigate back to the dashboard page and cancel the delete the submission
  await t
    .click(dashboard.trashButton)
    .click(Selector('[data-test-id=accept'))
    .expect(dashboard.trashButton.count)
    .eql(0)
})
