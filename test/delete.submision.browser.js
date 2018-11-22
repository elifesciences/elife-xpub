import config from 'config'
import { author, dashboard, login, wizardStep } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'

const f = fixture('Submission')
setFixtureHooks(f)

test('Create a Submission', async t => {
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
    .eql('example@example.org')
    .expect(author.institutionField.value)
    .eql('Tech team, University of eLife')
    .click(wizardStep.next)

  // navigate back to the dashboard page and delete the submission
  await t
    .navigateTo(`${config.get('pubsweet-server.baseUrl')}`)
    .click(dashboard.trashButton)
    .wait(1000)
    .expect(dashboard.trashButton.count)
    .eql(0)
})
