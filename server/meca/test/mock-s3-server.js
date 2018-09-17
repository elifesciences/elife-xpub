const util = require('util')
const https = require('https')
const S3rver = require('s3rver')
const AWS = require('aws-sdk')
let instance;

async function startServer(options) {
  const instance = await new Promise((resolve, reject) => {
    let server;
    server = new S3rver({
      directory: '/tmp/s3rver_test_directory',
      removeBucketsOnClose: true
    }).run(() => {
      resolve(server)
    });
  });

  const s3 = new AWS.S3({ ...options });

  await new Promise((resolve, reject) => {
    // S3 functions modify parameters, so we clone the parameters
    const params = Object.assign({}, options.params)

    s3.createBucket(params, function(err, data) {
      if(err) reject(err)
      resolve(data)
    })
  })

  return { instance, s3 };
}

module.exports = startServer
