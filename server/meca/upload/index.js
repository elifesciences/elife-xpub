const { uploadToSFTP } = require('./sftp');
const { uploadToS3 } = require('./s3');

async function upload(file, id) {
  await Promise.all([
    uploadToSFTP(file, id),
    uploadToS3(file, id)
  ])
}

module.exports = upload
