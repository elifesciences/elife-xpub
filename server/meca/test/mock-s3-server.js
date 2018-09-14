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

  const s3 = new AWS.S3({
    ...options,
    endpoint: new AWS.Endpoint('http://localhost:4578'),
    s3ForcePathStyle: true
  });

  await new Promise((resolve, reject) => {
    s3.createBucket(options.params, function(err, data) {
      if(err) reject(err)
      resolve(data)
    })
  })

  return { instance, s3 };
}

module.exports = startServer
