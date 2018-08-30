import config from 'config'
import { Selector } from 'testcafe'

const metadata = {
  url: `${config.get('pubsweet-server.baseUrl')}/submit/submission`,
  title: Selector('[name="meta.title"]'),
  articleType: Selector('[role=listbox] button'),
  articleTypes: Selector('[role=option]'),
  subjectAreaLabel: Selector('label[for=subject-area-select]'),

  discussionCheckbox: Selector('[name="previouslyDiscussedToggle"]'),
  discussionText: Selector('[name="previouslyDiscussed"]'),

  previousArticleCheckbox: Selector('[name="previouslySubmittedToggle"]'),
  previousArticleText: Selector('[name="previouslySubmitted.0"]'),

  cosubmissionCheckbox: Selector('[name="cosubmissionToggle"]'),
  firstCosubmissionTitle: Selector('[name="firstCosubmissionTitle"]'),
  secondCosubmissionTitle: Selector('[name="secondCosubmissionTitle"]'),
  moreSubmission: Selector('[name="moreSubmission"]'),
}

export default metadata
