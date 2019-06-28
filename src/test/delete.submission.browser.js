import config from 'config'
import { Selector } from 'testcafe'
import { dashboard } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'
import NavigationHelper from './helpers/navigationHelper'

const f = fixture('Submission')
setFixtureHooks(f)

test('Delete a Submission', async t => {
  const navigationHelper = new NavigationHelper(t)
  await navigationHelper.login()
  await navigationHelper.newSubmission()

  // create a new submission
  await navigationHelper.preFillAuthorDetailsWithOrcid()
  await navigationHelper.setAuthorEmail()
  await navigationHelper.navigateForward()

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
