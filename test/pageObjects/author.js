import config from 'config'
import { Selector } from 'testcafe'

const author = {
  url: `${config.get('pubsweet-server.baseUrl')}/submit`,
  orcidPrefill: Selector('[data-test-id=orcid-prefill]'),
  firstNameField: Selector('[name="author.firstName"]'),
  secondNameField: Selector('[name="author.lastName"]'),
  emailField: Selector('[name="author.email"]'),
  emailValidationMessage: Selector('[data-test-id="error-author.email"]'),
  institutionField: Selector('[name="author.aff"]'),
}

export default author
