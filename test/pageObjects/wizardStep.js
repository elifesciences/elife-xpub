import { Selector } from 'testcafe'

const wizardStep = {
  back: Selector('[data-test-id=back]'),
  next: Selector('[data-test-id=next]'),
}

export default wizardStep
