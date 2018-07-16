import config from 'config'
import { Selector } from 'testcafe'

const metadata = {
  url: `${config.get('pubsweet-server.baseUrl')}/submit/metadata`,
  title: Selector('[name=title]'),
  articleType: Selector('[role=listbox] button'),
  articleTypes: Selector('[role=option]'),
  subjectAreaLabel: Selector('label[for=subject-area-select]'),
  discussion: Selector('[name="submissionMeta.discussion"]').parent(),
  previousArticle: Selector('[name="submissionMeta.previousArticle"]').parent(),
  cosubmission: Selector('[name="submissionMeta.cosubmission"]').parent(),
  cosubmissionTitle: Selector('[name="submissionMeta.cosubmissionTitle"]'),
}

export default metadata
