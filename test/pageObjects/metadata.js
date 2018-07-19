import config from 'config'
import { Selector } from 'testcafe'

const metadata = {
  url: `${config.get('pubsweet-server.baseUrl')}/submit/metadata`,
  title: Selector('[name=title]'),
  articleType: Selector('[role=listbox] button'),
  articleTypes: Selector('[role=option]'),
  subjectAreaLabel: Selector('label[for=subject-area-select]'),

  discussionCheckbox: Selector('[name="discussion"]'),
  discussionText: Selector('[name="submissionMeta.discussion"]'),

  previousArticleCheckbox: Selector('[name="previousArticle"]'),
  previousArticleText: Selector('[name="submissionMeta.previousArticle"]'),

  cosubmissionCheckbox: Selector('[name="cosubmission"]'),
  firstCosubmissionTitle: Selector(
    '[name="submissionMeta.firstCosubmissionTitle"]',
  ),
  secondCosubmissionTitle: Selector(
    '[name="submissionMeta.secondCosubmissionTitle"]',
  ),
  moreSubmission: Selector('[name="submissionMeta.moreSubmission"]'),
}

export default metadata
