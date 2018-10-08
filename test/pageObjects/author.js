import config from 'config'
import { Selector } from 'testcafe'

const author = {
  url: new RegExp(
    `${config.get('pubsweet-server.baseUrl')}/submit/[a-f0-9-]{36}`,
  ),
  orcidPrefill: Selector('[data-test-id=orcid-prefill]'),
  firstNameField: Selector('[name="author.firstName"]'),
  secondNameField: Selector('[name="author.lastName"]'),
  emailField: Selector('[name="author.email"]'),
  emailValidationMessage: Selector('[data-test-id="error-author.email"]'),
  institutionField: Selector('[name="author.aff"]'),
}

export default author
