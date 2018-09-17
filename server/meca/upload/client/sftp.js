const SftpClient = require('ssh2-sftp-client')
const config = require('config')

async function SFTP() {
  const sftp = new SftpClient()
  await sftp.connect(config.get('meca.sftp'))
  return sftp;
}

module.exports = SFTP
