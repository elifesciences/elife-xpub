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
  navigationHelper.fillCoverletter('\nPlease consider this for publication')
  navigationHelper.uploadManuscript(manuscript)
  navigationHelper.wait(1000)
  // TODO ... this wait is bad
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
    .typeText(editors.firstReviewerName, 'Edward')
    .typeText(editors.firstReviewerEmail, 'edward@example.com')
    .typeText(editors.secondReviewerName, 'Frances')
    .typeText(editors.secondReviewerEmail, 'frances@example.net')
    .typeText(editors.thirdReviewerName, 'George')
    .typeText(editors.thirdReviewerEmail, 'george@example.org')
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

  await navigationHelper.consentDisclosure()
  await navigationHelper.submit()
  await navigationHelper.accept()

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
