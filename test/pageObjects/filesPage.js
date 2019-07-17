import config from 'config'
import { files } from './'

export class filesPage {
  constructor(t) {
    this.t = t
  }

  longText =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas semper ante sed volutpat tincidunt.\n\n Nullam rutrum tortor in libero cursus, sit amet dictum ex consectetur. In eget quam ac felis suscipit sodales euismod ac urna. Donec varius mollis sapien ac pharetra. Sed non nunc neque.\n\n Aenean at lorem nisi. Etiam tempor, turpis vitae fringilla sodales, ante felis posuere eros, et imperdiet ante nisi vel tellus.'
  shortText = 'Lorem ipsum'

  sbTimeout = config.get('scienceBeam.timeoutMs')
  // This timeout should be bigger than the sciencebeam timeout (20s)
  opts = { timeout: this.sbTimeout + 5000 }

  async writeCoverLetter(text = this.shortText) {
    await this.t.typeText(files.editor, text)
  }

  async writeShortCoverLetter() {
    await this.writeCoverLetter(this.shortText)
  }

  async writeLongCoverLetter() {
    await this.writeCoverLetter(this.longText)
  }

  async uploadManuscript(manuscript, message = 'Replace') {
    await this.t
      .setFilesToUpload(files.manuscriptUpload, manuscript.file)
      .expect(files.dropzoneMessage.textContent)
      .contains(message, this.opts)
  }

  async uploadSupportingFiles(supportingFiles) {
    await this.t.setFilesToUpload(files.supportingFilesUpload, supportingFiles)
  }
}
