import config from 'config'
import { Selector } from 'testcafe'

const disclosure = {
  url: new RegExp(
    `${config.get('pubsweet-server.baseUrl')}/submit/[a-f0-9-]{36}/disclosure`,
  ),
  submitterName: Selector('[name="submitterSignature"]'),
  consentCheckbox: Selector('[name="disclosureConsent"]').parent(),
  title: Selector('[data-test-id=disclosure-title]'),
  name: Selector('[data-test-id=disclosure-name]'),
  validationWarning: Selector('[data-test-id="test-error-message"]'),
  consentValidationWarning: Selector(
    '[data-test-id="error-disclosureConsent"]',
  ),
}

export default disclosure
