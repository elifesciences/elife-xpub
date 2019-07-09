import { dashboard } from './'

export class dashboardPage {
  constructor(t) {
    this.t = t
  }

  async startNewSubmission() {
    await this.t.click(dashboard.desktopNewSubmission)
  }

  async continueSubmission(id) {
    await this.t.click(
      id ? dashboard.continueSubmission(id) : dashboard.continueSubmission,
    )
  }

  async deleteSubmission(id) {
    await this.t.click(
      id ? dashboard.trashSpecificSubmission(id) : dashboard.trashButton,
    )
    await this.t.click('[data-test-id=accept]')
  }
}
