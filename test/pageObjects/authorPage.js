import { author } from './'

export class authorPage {
  constructor(t) {
    this.t = t
  }

  async preFillAuthorDetailsWithOrcid() {
    await this.t.click(author.orcidPrefill)
  }

  async setFirstName(firstName = 'Aaron') {
    await this.t
      .selectText(author.firstNameField)
      .typeText(author.firstNameField, firstName)
  }

  async setSurname(surname = 'Swartz') {
    await this.t
      .selectText(author.secondNameField)
      .typeText(author.secondNameField, surname)
  }

  async setEmail(email = 'test@example.com') {
    await this.t
      .selectText(author.emailField)
      .typeText(author.emailField, email)
  }

  async setInstitution(institution = 'University of eLife') {
    await this.t
      .selectText(author.institutionField)
      .typeText(author.institutionField, institution)
  }
}
