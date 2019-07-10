import { Selector } from 'testcafe'
import { disclosure, wizardStep, thankyou } from './'

export class disclosurePage {
  constructor(t) {
    this.t = t
  }

  async consentDisclosure(name = 'Joe Blogs') {
    await this.t
      .typeText(disclosure.submitterName, name)
      .click(disclosure.consentCheckbox)
  }

  async submit() {
    await this.t.click(wizardStep.submit)
    // wait for "accept" button to show
    this.t.expect(Selector(`[data-test-id="accept"]`))
  }

  async accept() {
    await this.t.click(wizardStep.accept)
    // wait for "finish" button to show
    this.t.expect(Selector(`[data-test-id="finish"]`))
  }

  async thankyou() {
    await this.t.click(thankyou.finish)
    // wait for "desktop-new-submission" button to show
    this.t.expect(Selector(`[data-test-id="desktop-new-submission"]`))
  }
}
