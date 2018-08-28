import config from 'config'
import { Selector } from 'testcafe'

const disclosure = {
  url: `${config.get('pubsweet-server.baseUrl')}/submit/disclosure`,
  submitterName: Selector('[name="submitterSignature"]'),
  consentCheckbox: Selector('[name="disclosureConsent"]').parent(),
}

export default disclosure
