import config from 'config'
import { Selector } from 'testcafe'

const demographic = {
  url: new RegExp(
    `${config.get('pubsweet-server.baseUrl')}/survey/[a-f0-9-]{36}`,
  ),
  question1: Selector('[data-test-id=survey-question-1]'),
  question2: Selector('[data-test-id=survey-question-2]'),
  question3: Selector('[data-test-id=survey-question-3]'),
  submit: Selector('[data-test-id=submit]'),
}

export default demographic
