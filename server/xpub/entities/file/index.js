const config = require('config')
const lodash = require('lodash')
const AWS = require('aws-sdk')
const fs = require('fs-extra')
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
    if (file.id) {
      await dataAccess.update(file)
      return file
    }

    const id = await dataAccess.insert(file)
    return { ...file, id }
  },
  putContent: async (file, content, { size } = {}) => {
    if (!file.id) {
      throw new Error('File has no ID, must be saved first')
    }

    // S3 only accepts streams of actual files on disk
    // so stream to a temp file first
    const tempFilePath = `/tmp/s3-pass-through/${Math.random()
      .toString(36)
      .substr(2)}`
    await fs.ensureFile(tempFilePath)
    const writeStream = fs.createWriteStream(tempFilePath)
    content.pipe(writeStream)
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve)
      writeStream.on('error', reject)
    })

    const readStream = fs.createReadStream(tempFilePath)
    const response = await s3
      .putObject({
        Body: readStream,
        Key: `${file.url}/${file.id}`,
        ContentType: file.mimetype,
        ContentLength: size,
        ACL: 'private',
      })
      .promise()
    await fs.remove(tempFilePath)
    return response
  },
  getContent: async file => {
    const { Body } = await s3
      .getObject({ Key: `${file.url}/${file.id}` })
      .promise()
    return Body
  },
}

module.exports = FileManager
