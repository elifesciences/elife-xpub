import { Selector } from 'testcafe'
import { editors } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'
import NavigationHelper from './helpers/navigationHelper'

const f = fixture('PeoplePicker')
setFixtureHooks(f)

const manuscript = {
  title: 'The Relationship Between Lamport Clocks and Interrupts Using Obi',
  file: './fixtures/dummy-manuscript-2.pdf',
  supportingFiles: [
    './fixtures/dummy-supporting-1.pdf',
    './fixtures/dummy-supporting-2.docx',
  ],
}

test('People Picker', async t => {
  const navigationHelper = new NavigationHelper(t)
  const editorsPage = navigationHelper.getEditorsPage()

  await navigationHelper.skipToEditorsPage(manuscript)

  // selecting suggested and excluded editors & reviewers
  await editorsPage.openEditorsPicker()
  await editorsPage.selectPeople([0, 2, 3, 5, 7])
  await editorsPage.viewPersonInfo(9)

  // open modal, and we should be able to select this editor as maximun limit is not reach
  await t
    .expect(editors.peoplePickerModalErrorMaximum.count)
    .eql(0)
    .click(Selector('[data-test-id="accept"]'))

  // limit of editors reach, we should get an error in the modal
  await editorsPage.viewPersonInfo(10)
  await t
    .expect(editors.peoplePickerModalErrorMaximum.count)
    .eql(1)
    .click(Selector('[data-test-id="cancel"]'))

  // click on an editor already added, it should display 'REMOVE EDITOR'
  await editorsPage.viewPersonInfo(3)
  await t
    .expect(Selector('[data-test-id="accept"]').innerText)
    .eql('REMOVE EDITOR')
    .click(Selector('[data-test-id="accept"]'))

  // then we should be able to add a new editor
  await editorsPage.viewPersonInfo(10)
  await t
    .expect(editors.peoplePickerModalErrorMaximum.count)
    .eql(0)
    .click(Selector('[data-test-id="accept"]'))

  await editorsPage.closePeoplePicker()
  await editorsPage.selectSeniorReviewers([1, 4])

  await t.expect(editors.validationErrors.withText(/./).count).eql(0)
})
