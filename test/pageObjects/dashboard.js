import config from 'config'
import { Selector } from 'testcafe'

const dashboard = {
  url: `${config.get('pubsweet-server.baseUrl')}`,
  submitManuscript: Selector('[data-test-id=submit]'),
  titles: Selector('[data-test-id=title]'),
  statuses: Selector('[data-test-id=status]'),
}

export default dashboard
