import { ClientFunction } from 'testcafe'
import config from 'config'
import setFixtureHooks from './helpers/set-fixture-hooks'
import NavigationHelper from './helpers/navigationHelper'

const f = fixture('Submission')
setFixtureHooks(f)

test('Interrupt and resume Submission', async t => {
  const navigationHelper = new NavigationHelper(t)
  const dashboardPage = navigationHelper.getDashboardPage()

  // create a new submission
  await navigationHelper.skipToFilesPage()
  const submissionId = await navigationHelper.getSubmissionId()

  // navigate back to the dashboard page and continue submission
  await t.navigateTo(`${config.get('pubsweet-server.baseUrl')}`)
  await dashboardPage.continueSubmission(submissionId)

  // get current location and check if it matches whith the last visited one.
  const getLocation = ClientFunction(() => document.location.href)
  await t.expect(getLocation()).contains('/files')
})
