import { editors } from './'

export class editorsPage {
  constructor(t) {
    this.t = t
  }

  longText =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas semper ante sed volutpat tincidunt.\n\n Nullam rutrum tortor in libero cursus, sit amet dictum ex consectetur. In eget quam ac felis suscipit sodales euismod ac urna. Donec varius mollis sapien ac pharetra. Sed non nunc neque.\n\n Aenean at lorem nisi. Etiam tempor, turpis vitae fringilla sodales, ante felis posuere eros, et imperdiet ante nisi vel tellus.'
  shortText = 'Lorem ipsum'

  async openEditorsPicker() {
    await this.t.click(editors.suggestedSeniorEditorSelection)
  }

  async openReviewerPicker() {
    await this.t.click(editors.suggestedReviewingEditorSelection)
  }

  async closePeoplePicker() {
    await this.t.click(editors.peoplePickerSubmit)
  }

  async selectPeople(people) {
    await Promise.all(
      people.map(async person => this.t.click(editors.peoplePickerOptions.nth(person))),
    )
  }

  async viewPersonInfo(person) {
    await this.t.click(editors.peoplePickerInfo.nth(person))
  }

  async selectSeniorEditors(people = []) {
    await this.t.click(editors.suggestedSeniorEditorSelection)
    await this.selectPeople(people)
    await this.t.click(editors.peoplePickerSubmit)
  }

  async selectSeniorReviewers(people = []) {
    await this.t.click(editors.suggestedReviewingEditorSelection)
    await this.selectPeople(people)
    await this.t.click(editors.peoplePickerSubmit)
  }
}
