const verifySubmissionId = uuid => {
  const uuidRegEx = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegEx.test(uuid)
}

module.exports = {
  verifySubmissionId,
}
