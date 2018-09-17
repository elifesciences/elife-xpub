const config = require('config')
const SFTP = require('./client/sftp');
const s3 = require('./client/s3');

async function uploadToS3(file, id) {
  const params = {
    ...config.get('meca.s3.params'),
    Body: file,
    Key: id,
    ACL: 'public-read'
  }

  await new Promise((resolve, reject) => {
    s3.putObject(params, (err, data) => {
      if(err) reject(err)
      resolve()
    })
  })
}

async function uploadToSFTP(file, id) {
  const sftp = await SFTP()
  const remotePath = config.get('meca.remotePath')
  await sftp.mkdir(remotePath, true)
  await sftp.put(file, `${remotePath}/${id}`)
  await sftp.end()
}

async function upload(file, id) {
  await Promise.all([
    uploadToSFTP(file, id),
    uploadToS3(file, id)
  ])
}

module.exports = upload
