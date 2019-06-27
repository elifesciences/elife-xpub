import { ClientFunction } from 'testcafe'
import config from 'config'
import { dashboard } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'
import NavigationHelper from './helpers/navigationHelper'

const f = fixture('Submission')
setFixtureHooks(f)

test('Interrupt and resume Submission', async t => {
  const navigationHelper = new NavigationHelper(t)

  // create a new submission
  await navigationHelper.skipToFilesPage()

  // wait 5 seconds to ensure autosave hasn't interrupted the navigation save
  // await navigationHelper.wait(5000)

  // navigate back to the dashboard page and continue submission
  await t
    .navigateTo(`${config.get('pubsweet-server.baseUrl')}`)
    .click(dashboard.continueSubmission)

  // get current location and check if it matches whith the last visited one.
  const getLocation = ClientFunction(() => document.location.href)
  await t.expect(getLocation()).contains('/files')
})
