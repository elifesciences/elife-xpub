import config from 'config'
import { Selector } from 'testcafe'

const disclosure = {
  url: new RegExp(
    `${config.get('pubsweet-server.baseUrl')}/submit/[a-f0-9-]{36}/disclosure`,
  ),
  submitterName: Selector('[name="submitterSignature"]'),
  consentCheckbox: Selector('[name="disclosureConsent"]').parent(),
}

export default disclosure
