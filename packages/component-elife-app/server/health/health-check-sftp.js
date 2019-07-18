const checkSFTP = async (config, sftp) => {
  if (config.get('meca.sftp.disableUpload')) {
    return 'DISABLED'
  }

  let result
  try {
    await sftp.connect(config.get('meca.sftp.connectionOptions'))
    await sftp.end()
    result = ''
  } catch (error) {
    result = error.message
  }
  return result
}

module.exports = checkSFTP
