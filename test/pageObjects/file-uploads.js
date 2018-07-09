import config from 'config'
import { Selector } from 'testcafe'

const fileUploads = {
  url: `${config.get('pubsweet-server.baseUrl')}/submit/upload`,
  editor: Selector(
    '[name="submissionMeta.coverLetter"] div[contenteditable=true]',
  ),
  manuscriptUpload: Selector('[data-test-id=upload]>input'),
  preview: Selector('[data-test-id=preview]'),
}

export default fileUploads
