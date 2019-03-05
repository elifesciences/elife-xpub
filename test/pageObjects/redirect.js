import config from 'config'
import { Selector } from 'testcafe'

const login = {
  url: `${config.get('pubsweet-server.baseUrl')}/redirect`,
  button: Selector('[data-test-id=redirect-continue]'),
}

export default login
