/* eslint no-console: 0 */

/*
 * Uploads a folder from your local volume to AWS S3
 *
 * node scripts/upload-to-s3.js FROM_DIR TO_DIR
 *
 * - FROM_DIR: local folder to upload. Default=build
 * - TO_DIR: folder within S3 to upload to.
 *   Will be created if the folder doesn't exist .
 *   Default=build
 */


global.__basedir = `${__dirname}/../`

const AWS = require('aws-sdk')
const config = require('config')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const mime = require('mime')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const readFile = promisify(fs.readFile)

const [
  fromDir='build',
  toDir='build'
] = process.argv.slice(2,4)

const dirPath = path.join(global.__basedir, fromDir)

const S3 = new AWS.S3({
  ...config.get('aws.credentials'),
  ...config.get('aws.s3'),
  apiVersion: '2006-03-01',
})

async function getFiles(dir, { prefix='' }={}) {
  const files = await readdir(dir)
  const filePaths = await Promise.all(files.map(
    async (fileName) => {
      const filePath = path.join(dir, fileName)
      const pathStat = await stat(filePath)
      if(pathStat.isFile())
        return { fileName: `${prefix}${fileName}`, filePath }
      else if (pathStat.isDirectory())
        return getFiles(filePath, { prefix: `${prefix}${fileName}/` })
      return null
    }
  ))
  return _.flattenDeep(filePaths)
}

async function upload() {
  const files = await getFiles(dirPath)
  if(!files || files.length === 0) {
    throw new Error(`Directory '${dirPath}' is empty or does not exist.`)
  }
  await uploadToS3(files)
}

async function uploadToS3(files){
  await Promise.all(files.map(
    async ({ fileName, filePath }) => {
      const Body = await readFile(filePath)
      const params = {
        Body,
        Key: `${toDir}/${fileName}`,
        ContentType: mime.getType(path.extname(fileName)),
      }
      console.log(`Uploading ${params.Key}`)
      await S3.putObject(params).promise()
    }
  ))
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
