import config from 'config'
import { Selector } from 'testcafe'

const files = {
  url: new RegExp(
    `${config.get('pubsweet-server.baseUrl')}/submit/[a-f0-9-]{36}/files`,
  ),
  editor: Selector('[name="coverLetter"] div[contenteditable=true]'),
  manuscriptUpload: Selector('[data-test-id=upload]>input'),
  supportingFilesUploadLink: Selector('[data-test-id=supportingFilesLink]'),
  supportingFilesUpload: Selector('[data-test-id=supportingFilesUpload]>input'),
}

export default files
