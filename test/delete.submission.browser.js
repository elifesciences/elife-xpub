import config from 'config'
import { Selector } from 'testcafe'
import { author, dashboard, wizardStep } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'
import NavigationHelper from './helpers/navigationHelper'

const f = fixture('Submission')
setFixtureHooks(f)

test('Delete a Submission', async t => {
  const navigationHelper = new NavigationHelper(t)
  navigationHelper.login()
  navigationHelper.newSubmission()

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
    .eql('Josiah')
    .expect(author.secondNameField.value)
    .eql('Carberry')
    .expect(author.emailField.value)
    .eql('j.carberry@orcid.org')
    .expect(author.institutionField.value)
    .eql('Psychoceramics, Wesleyan University')
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
