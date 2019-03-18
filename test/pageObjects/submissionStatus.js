import config from 'config'
import { Selector } from 'testcafe'

const submissionStatus = {
  url: new RegExp(
    `${config.get('pubsweet-server.baseUrl')}/submissions/[a-f0-9-]{36}`,
  ),
  welcomeMessage: Selector('[data-test-id="welcome-message"]'),
}

export default submissionStatus
