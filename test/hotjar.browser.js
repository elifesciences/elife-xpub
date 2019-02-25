import { Selector } from 'testcafe'

import { author, dashboard, login, wizardStep, profile } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'

const f = fixture('Hotjar Suppression')
setFixtureHooks(f)

test('test suppression is in place for the name', async t => {
  await t
    .navigateTo(login.url)
    .click(login.button)
    .wait(1000)
    .click(profile.open)
    .expect(profile.name, { 'data-hj-suppress': '' })
    .ok()
})

test('test suppression is in place for the coverletter', async t => {
  // fill author's page
  await t
    .navigateTo(login.url)
    .click(login.button)
    .click(dashboard.desktopNewSubmission)
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

  await t
    .expect(Selector('[data-test-id=coverletterEditor]'), {
      'data-hj-suppress': '',
    })
    .ok()
})
