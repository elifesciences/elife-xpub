import { Selector } from 'testcafe'
import { profile, disclosure, dashboard, thankyou } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'
import NavigationHelper from './helpers/navigationHelper'

const f = fixture('Hotjar Suppression')
setFixtureHooks(f)

const manuscript = {
  title: 'The Relationship Between Lamport Clocks and Interrupts Using Obi',
  file: './fixtures/dummy-manuscript-2.pdf',
  supportingFiles: [
    './fixtures/dummy-supporting-1.pdf',
    './fixtures/dummy-supporting-2.docx',
  ],
}

test('test suppressions', async t => {
  const navigationHelper = new NavigationHelper(t)
  const dashboardPage = navigationHelper.getDashboardPage()
  const disclosurePage = navigationHelper.getDisclosurePage()
  const thankyouPage = navigationHelper.getThankyouPage()

  await navigationHelper.login()
  await navigationHelper.openProfile()
  await t.expect(profile.name, { 'data-hj-suppress': '' }).ok()
  await dashboardPage.startNewSubmission()

  // author's page
  await navigationHelper.fillAuthorPage()
  await navigationHelper.navigateForward()

  // files' page
  await t
    .expect(Selector('[data-test-id=coverletterEditor]'), {
      'data-hj-suppress': '',
    })
    .ok()
  await navigationHelper.fillFilesPage(manuscript)
  await navigationHelper.navigateForward()

  // submission metadata
  await navigationHelper.fillDetailsPage()
  await navigationHelper.navigateForward()

  // editor's page
  await navigationHelper.fillEditorsPage()
  await navigationHelper.navigateForward()

  // disclosure's page
  await t
    .expect(disclosure.name, {
      'data-hj-suppress': '',
    })
    .ok()
    .expect(disclosure.title, {
      'data-hj-suppress': '',
    })
    .ok()

  await disclosurePage.consentDisclosure()
  await disclosurePage.submit()
  await disclosurePage.accept()

  await t
    .expect(thankyou.title, {
      'data-hj-suppress': '',
    })
    .ok()

  await navigationHelper.getDemographicPage().submitAnswers()
  await thankyouPage.finish()
  await t
    .expect(dashboard.titles, {
      'data-hj-suppress': '',
    })
    .ok()
})
