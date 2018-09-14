const https = require('https')
const S3 = require('aws-sdk/clients/s3')
const S3rver = require('s3rver')
const util = require('util')

options = {
      params: {
        Bucket: 'test'
      },
      region: 'eu-west-1',
      accessKeyId: '',
      secretAccessKey: '',
      endpoint: 'localhost',
      s3ForcePathStyle: true
    }

  instance = new S3rver({
    directory: '/tmp/s3rver_test_directory',
    // removeBucketsOnClose: true
  });

util.promisify(instance.run).call(instance).then(
  new Promise((resolve, reject) => {
      const s3 = new S3({
        ...options,
        apiVersion: '2006-03-01',
        httpOptions: {
          agent: new https.Agent({ rejectUnauthorized: false  })
        }
      });

      s3.createBucket(options.params, function(err, data) {
        if(err) reject(err)
        resolve(data)
      })
  })
).catch(console.log)
