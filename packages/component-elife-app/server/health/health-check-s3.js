const checkS3 = async (config, s3) => {
  if (config.get('meca.s3.disableUpload')) {
    return 'DISABLED'
  }

  let error
  let result
  try {
    result = s3.listObjects({}, (err, response) => {
      if (err) {
        error = err
      }
      return response
    })
  } catch (ex) {
    return ex.message
  }

  return error ? result : ''
}

module.exports = checkS3
