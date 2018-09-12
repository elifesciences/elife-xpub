const { uploadToSFTP } = require('./sftp');

async function upload(file, id) {
  await uploadToSFTP(file, id)
}

module.exports = upload
