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

  await navigationHelper.skipToEditorsPage(manuscript)

  // selecting suggested and excluded editors & reviewers
  await t
    .click(editors.suggestedSeniorEditorSelection)
    .click(editors.peoplePickerOptions.nth(0))
    .click(editors.peoplePickerOptions.nth(2))
    .click(editors.peoplePickerOptions.nth(3))
    .click(editors.peoplePickerOptions.nth(5))
    .click(editors.peoplePickerOptions.nth(7))
    .click(editors.peoplePickerInfo.nth(9))

    // open modal, and we should be able to select this editor as maximun limit is not reach
    .expect(editors.peoplePickerModalErrorMaximum.count)
    .eql(0)
    .click(Selector('[data-test-id="accept"]'))

    // limit of editors reach, we should get an error in the modal
    .click(editors.peoplePickerInfo.nth(10))
    .expect(editors.peoplePickerModalErrorMaximum.count)
    .eql(1)
    .click(Selector('[data-test-id="cancel"]'))

  // click on an editor already added, it should display 'REMOVE EDITOR'
  await t.click(editors.peoplePickerInfo.nth(3))
  await t
    .expect(Selector('[data-test-id="accept"]').innerText)
    .eql('REMOVE EDITOR')
    .click(Selector('[data-test-id="accept"]'))

  // then we should be able to add a new editor
  await t
    .click(editors.peoplePickerInfo.nth(10))
    .expect(editors.peoplePickerModalErrorMaximum.count)
    .eql(0)
    .click(Selector('[data-test-id="accept"]'))
    .click(editors.peoplePickerSubmit)
    .click(editors.suggestedReviewingEditorSelection)
    .click(editors.peoplePickerOptions.nth(1))
    .click(editors.peoplePickerOptions.nth(4))
    .click(editors.peoplePickerSubmit)
    .expect(editors.validationErrors.withText(/./).count)
    .eql(0)
})
