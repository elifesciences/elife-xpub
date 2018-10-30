global.__basedir = `${__dirname}/../`

const AWS = require('aws-sdk')
const config = require('config')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)
const dirPath = path.join(__basedir, '_build_styleguide/')

const S3 = new AWS.S3({
  ...config.get('aws.credentials'),
  ...config.get('aws.s3'),
  apiVersion: '2006-03-01',
})

async function upload() {
  const files = await readdir(dirPath)
  if(!files || files.length === 0) {
    throw new Error(`Directory '${dirPath}' is empty or does not exist.`)
  }
  // await S3.putObject(params).promise()
}

upload()
  .then(() => {
    console.log('Successfully uploaded to S3.')
    process.exit(0)
  })
  .catch((err) => {
    console.log('Failed to upload to S3')
    console.error(err)
    process.exit(1)
  })
