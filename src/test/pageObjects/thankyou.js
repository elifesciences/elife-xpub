import config from 'config'
import { Selector } from 'testcafe'

const thankyou = {
  url: new RegExp(
    `${config.get('pubsweet-server.baseUrl')}/thankyou/[a-f0-9-]{36}`,
  ),
  title: Selector('[data-test-id="title"]'),
  finish: Selector('[data-test-id="finish"]'),
}

export default thankyou
