import config from 'config'
import { Selector } from 'testcafe'

const files = {
  url: new RegExp(
    `${config.get('pubsweet-server.baseUrl')}/submit/[a-f0-9-]{36}/files`,
  ),
  editor: Selector('[name="coverLetter"] div[contenteditable=true]'),
  manuscriptUpload: Selector('[data-test-id=upload]>input'),
  supportingFilesUpload: Selector('[data-test-id=supportingFilesUpload]>input'),
  supportingFilesRemove: Selector('[data-test-id=supportingFilesRemove]'),
  supportingFile: Selector('[data-test-id=file_block_name]'),
  fileName: Selector('[data-test-id=fileName]'),
  dropzoneMessage: Selector('[data-test-id=dropzoneMessage]'),
}

export default files
