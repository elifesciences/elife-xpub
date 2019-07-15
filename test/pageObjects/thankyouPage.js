import { Selector } from 'testcafe'
import { thankyou } from './'

export class thankyouPage {
  constructor(t) {
    this.t = t
  }

  async finish() {
    await this.t.click(thankyou.finish)
    // wait for "desktop-new-submission" button to show
    this.t.expect(Selector(`[data-test-id="desktop-new-submission"]`))
  }
}
