import { ClientFunction } from 'testcafe'
import config from 'config'
import { author, dashboard, login, wizardStep } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'

//const f = fixture('Submission')
//setFixtureHooks(f)

test('Interrupt and resume Submission', async t => {
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

  // navigate back to the dashboard page and continue submission
  await t
    .navigateTo(`${config.get('pubsweet-server.baseUrl')}`)
    .click(dashboard.continueSubmission)

  // get current location and check if it matches whith the last visited one.
  const getLocation = ClientFunction(() => document.location.href)
  await t.expect(getLocation()).contains('/files')
})
