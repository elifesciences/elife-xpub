const config = require('config')
const lodash = require('lodash')
const AWS = require('aws-sdk')
const dataAccess = require('./data-access')

const s3 = new AWS.S3({
  ...config.get('aws.credentials'),
  ...config.get('aws.s3'),
  apiVersion: '2006-03-01',
})

const empty = {
  filename: '',
  label: '',
  type: 0,
  mime_type: '',
  size: 0,
  url: '',
}

const FileManager = {
  find: dataAccess.selectById,
  delete: dataAccess.delete,
  new: (props = {}) => lodash.merge({}, empty, props),
  save: async file => {
    let id = { file }
    if (file.id) {
      const updated = await dataAccess.update(file)
      if (!updated) {
        throw new Error('File not found')
      }
    } else {
      id = await dataAccess.insert(file)
    }

    return { ...file, id }
  },
  putContent: async (file, content, { size } = {}) => {
    if (!file.id) {
      throw new Error('File has no ID, must be saved first')
    }

    return s3
      .putObject({
        Body: content,
        Key: `${file.url}/${file.id}`,
        ContentType: file.mimetype,
        ContentLength: size,
        ACL: 'private',
      })
      .promise()
  },
  getContent: async file => {
    const { Body } = await s3
      .getObject({ Key: `${file.url}/${file.id}` })
      .promise()
    return Body
  },
}

module.exports = FileManager
