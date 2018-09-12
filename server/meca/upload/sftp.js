const SftpClient = require('ssh2-sftp-client')
const config = require('config')

async function uploadToSFTP(file, id) {
  const sftp = new SftpClient()
  await sftp.connect(config.get('meca.sftp'))

  const remotePath = config.get('meca.remotePath')
  await sftp.mkdir(remotePath, true)

  await sftp.put(file, `${remotePath}/${id}`)
  await sftp.end()
}

module.exports = { uploadToSFTP }
