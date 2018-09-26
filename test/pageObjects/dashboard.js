import config from 'config'
import { Selector } from 'testcafe'

const dashboard = {
  url: `${config.get('pubsweet-server.baseUrl')}`,
  submitManuscript: Selector('[data-test-id=submit]'),
  titles: Selector('[data-test-id=title]'),
  stages: Selector('[data-test-id=stage]'),
}

export default dashboard
