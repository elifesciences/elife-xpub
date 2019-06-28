import config from 'config'
import { Selector } from 'testcafe'

const login = {
  url: `${config.get('pubsweet-server.baseUrl')}/login`,
  button: Selector('[data-test-id=login]'),
}

export default login
