import config from 'config'
import { t, Selector } from 'testcafe'

const dashboard = {
  url: `${config.get('pubsweet-server.baseUrl')}`,
  login: async () => {
    await t.navigateTo(config.get('pubsweet-server.baseUrl'))
    await t.ctx.localStorageSet(t.ctx.token)
  },
  titles: Selector('[data-test-id=title]'),
  stages: Selector('[data-test-id=stage]'),
}

export default dashboard
