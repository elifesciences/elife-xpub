import config from 'config'
import { Selector } from 'testcafe'

const fileUploads = {
  url: `${config.get('pubsweet-server.baseUrl')}/submit/files`,
  editor: Selector('[name="coverLetter"] div[contenteditable=true]'),
  manuscriptUpload: Selector('[data-test-id=upload]>input'),
  preview: Selector('[data-test-id=preview]'),
}

export default fileUploads
