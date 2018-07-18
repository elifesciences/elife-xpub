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
  cosubmission0Title: Selector('[name="submissionMeta.cosubmission.0.title"]'),
  cosubmission1Title: Selector('[name="submissionMeta.cosubmission.1.title"]'),
  moreSubmission: Selector('[name="submissionMeta.moreSubmission"]'),
}

export default metadata
