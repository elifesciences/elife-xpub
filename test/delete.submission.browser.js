import config from 'config'
import { Selector } from 'testcafe'
import { dashboard } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'
import NavigationHelper from './helpers/navigationHelper'

const f = fixture('Submission')
setFixtureHooks(f)

test('Delete a Submission', async t => {
  const navigationHelper = new NavigationHelper(t)
  const dashboardPage = navigationHelper.getDashboardPage()
  const authorPage = navigationHelper.getAuthorPage()

  await navigationHelper.skipToAuthorPage()

  // create a new submission
  await authorPage.preFillAuthorDetailsWithOrcid()
  await authorPage.setEmail()
  await navigationHelper.navigateForward()
  const submissionId = await navigationHelper.getSubmissionId()

  // navigate back to the dashboard page and cancel the delete the submission
  await t
    .navigateTo(`${config.get('pubsweet-server.baseUrl')}`)
    .click(dashboard.trashButton(submissionId))
    .click(Selector('[data-test-id=cancel'))
    .expect(dashboard.trashButton(submissionId).exists)
    .ok()

  await dashboardPage.deleteSubmission(submissionId)
})
