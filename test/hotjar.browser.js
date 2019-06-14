import { Selector } from 'testcafe'
import {
  editors,
  profile,
  disclosure,
  dashboard,
  thankyou,
} from './pageObjects'
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

  navigationHelper.login()
  navigationHelper.openProfile()

  await t.expect(profile.name, { 'data-hj-suppress': '' }).ok()
  navigationHelper.newSubmission()

  // author's page
  navigationHelper.preFillAuthorDetailsWithOrcid()
  navigationHelper.setAuthorEmail('example@example.org')
  navigationHelper.navigateForward()

  // files' page
  await t
    .expect(Selector('[data-test-id=coverletterEditor]'), {
      'data-hj-suppress': '',
    })
    .ok()
  navigationHelper.fillCoverletter()
  navigationHelper.uploadManuscript(manuscript)
  navigationHelper.navigateForward()

  // submission metadata
  navigationHelper.addManuscriptMetadata()
  navigationHelper.navigateForward()

  // editor's page
  navigationHelper.openEditorsPicker()
  navigationHelper.selectPeople([0, 2, 3])
  navigationHelper.closePeoplePicker()

  navigationHelper.openReviewerPicker()
  navigationHelper.selectPeople([1, 4, 6])
  navigationHelper.closePeoplePicker()

  await t
    .typeText(editors.firstReviewerName, 'Edward', { paste: true })
    .typeText(editors.firstReviewerEmail, 'edward@example.com', { paste: true })
    .typeText(editors.secondReviewerName, 'Frances', { paste: true })
    .typeText(editors.secondReviewerEmail, 'frances@example.net', {
      paste: true,
    })
    .typeText(editors.thirdReviewerName, 'George', { paste: true })
    .typeText(editors.thirdReviewerEmail, 'george@example.org', { paste: true })
  navigationHelper.navigateForward()

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

  navigationHelper.consentDisclosure()
  navigationHelper.submit()
  navigationHelper.accept()

  await t
    .expect(thankyou.title, {
      'data-hj-suppress': '',
    })
    .ok()

  navigationHelper.thankyou()
  await t
    .expect(dashboard.titles, {
      'data-hj-suppress': '',
    })
    .ok()
})
