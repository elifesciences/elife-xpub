import { Selector } from 'testcafe'

const wizardStep = {
  back: Selector('[data-test-id=back]'),
  next: Selector('[data-test-id=next]'),
  submit: Selector('[data-test-id=submit]'),
  accept: Selector('[data-test-id=modal-dialog-accept]'),
}

export default wizardStep
