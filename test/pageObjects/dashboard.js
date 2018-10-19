import config from 'config'
import { Selector } from 'testcafe'

const dashboard = {
  url: `${config.get('pubsweet-server.baseUrl')}`,
  desktopNewSubmission: Selector('[data-test-id=desktop-new-submission]'),
  mobileNewSubmission: Selector('[data-test-id=mobile-new-submission]'),
  titles: Selector('[data-test-id=title]'),
  statuses: Selector('[data-test-id=status]'),
}

export default dashboard
