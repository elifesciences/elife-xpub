const { validateFileSize } = require('./helpers')
const config = require('config')

describe('validateFileSize', () => {
  const maxSize = config.get('fileUpload.maxSizeMB')
  const invalidFileSize = (maxSize + 1) * 1e6
  const validFileSize = (maxSize - 1) * 1e6

  it('will throw error if the file size is more than MaxSize', () => {
    expect(() => validateFileSize(invalidFileSize)).toThrow(
      new Error(`File size shouldn't exceed ${maxSize}MB`),
    )
  })
  it('does not throw if the file size is less than MaxSize', () => {
    expect(() => validateFileSize(validFileSize)).not.toThrow()
  })
})
