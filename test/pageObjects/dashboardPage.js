import { dashboard } from './'
import { verifySubmissionId } from '../helpers/verify'

export class dashboardPage {
  constructor(t) {
    this.t = t
  }

  async startNewSubmission() {
    await this.t.click(dashboard.desktopNewSubmission)
  }

  async continueSubmission(id) {
    await this.t.expect(verifySubmissionId(id)).ok('not a submission id')
    await this.t.click(dashboard.continueSubmission(id))
  }

  async deleteSubmission(id) {
    await this.t.expect(verifySubmissionId(id)).ok('not a submission id')
    await this.t.click(dashboard.trashButton(id))
    await this.t.click('[data-test-id=accept]')
  }
}
