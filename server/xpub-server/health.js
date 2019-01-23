const config = require('config')
const db = require('@pubsweet/db-manager/src/db')
const AWS = require('aws-sdk')

const S3_API_VERSION = '2006-03-01'

const s3 = new AWS.S3({
  ...config.aws.credentials,
  ...config.aws.s3,
  apiVersion: S3_API_VERSION,
})

const checkS3 = () =>
  new Promise(resolve => {
    s3.listObjects({}, (err, response) => {
      if (err) {
        resolve(err)
      } else {
        resolve(response)
      }
    })
  })

const checkDataBase = () =>
  new Promise(resolve => {
    db.select('table_name')
      .from('information_schema.tables')
      .then(response => resolve(response))
      .catch(error => resolve(error))
  })

module.exports = {
  checkDataBase,
  checkS3,
}
