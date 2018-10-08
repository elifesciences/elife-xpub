import config from 'config'
import { Selector } from 'testcafe'

const submission = {
  url: new RegExp(
    `${config.get('pubsweet-server.baseUrl')}/submit/[a-f0-9-]{36}/submission`,
  ),
  title: Selector('[name="meta.title"]'),
  articleType: Selector('[role=listbox] button'),
  articleTypes: Selector('[role=option]'),
  subjectAreaLabel: Selector('label[for=subject-area-select]'),

  discussionCheckbox: Selector('[name="previouslyDiscussedToggle"]').parent(),
  discussionText: Selector('[name="previouslyDiscussed"]'),

  previousArticleCheckbox: Selector(
    '[name="previouslySubmittedToggle"]',
  ).parent(),
  previousArticleText: Selector('[name="previouslySubmitted.0"]'),

  cosubmissionCheckbox: Selector('[name="cosubmissionToggle"]').parent(),
  firstCosubmissionTitle: Selector('[name="firstCosubmissionTitle"]'),
  secondCosubmissionTitle: Selector('[name="secondCosubmissionTitle"]'),
  moreSubmission: Selector('[name="moreSubmission"]'),
}

export default submission
