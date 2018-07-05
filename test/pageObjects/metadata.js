import config from 'config'
import { Selector } from 'testcafe'

const metadata = {
  url: `${config.get('pubsweet-server.baseUrl')}/submit/metadata`,
  title: Selector('[name=title]'),
  articleType: Selector('[role=listbox] button'),
  articleTypes: Selector('[role=option]'),
  subjectAreaLabel: Selector('label[for=subject-area-select]'),
  discussedPreviously: Selector(
    '[name="submissionMeta.discussedPreviously"]',
  ).parent(),
  discussion: Selector('[name="submissionMeta.discussion"]'),
  consideredPreviously: Selector(
    '[name="submissionMeta.consideredPreviously"]',
  ).parent(),
  previousArticle: Selector('[name="submissionMeta.previousArticle"]'),
  cosubmission: Selector('[name="submissionMeta.cosubmission"]').parent(),
  cosubmissionTitle: Selector('[name="submissionMeta.cosubmissionTitle"]'),
}

export default metadata
