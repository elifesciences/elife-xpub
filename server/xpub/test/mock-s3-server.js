const S3rver = require('s3rver')
const AWS = require('aws-sdk')

async function startServer(options) {
  const instance = await new Promise((resolve, reject) => {
    const server = new S3rver({
      directory: `/tmp/s3rver_test.${Math.random()
        .toString(36)
        .sub(2, 5)}`,
      removeBucketsOnClose: true,
    }).run(() => {
      resolve(server)
    })
  })

  const s3 = new AWS.S3({ ...options })

  // S3 functions modify parameters, so we clone the parameters
  await s3.createBucket({ ...options.params }).promise()

  return { instance, s3 }
}

module.exports = startServer
