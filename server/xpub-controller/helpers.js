const config = require('config')

module.exports = {
  validateFileSize: fileSize => {
    if (fileSize > config.get('fileUpload.maxSizeMB') * 1e6) {
      throw new Error(
        `File size shouldn't exceed ${config.get('fileUpload.maxSizeMB')}MB`,
      )
    }
  },
}
