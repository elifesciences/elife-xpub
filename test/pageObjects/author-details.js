import config from 'config'
import { Selector } from 'testcafe'

const authorDetails = {
  url: `${config.get('pubsweet-server.baseUrl')}/submit`,
  orcidPrefill: Selector('[data-test-id=orcid-prefill]'),
  firstNameField: Selector('[name="submissionMeta.author.firstName"]'),
  secondNameField: Selector('[name="submissionMeta.author.lastName"]'),
  emailField: Selector('[name="submissionMeta.author.email"]'),
  emailValidationMessage: Selector(
    '[data-test-id="error-submissionMeta.author.email"]',
  ),
  institutionField: Selector('[name="submissionMeta.author.institution"]'),
}

export default authorDetails
