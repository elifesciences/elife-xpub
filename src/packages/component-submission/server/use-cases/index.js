const SupportingFiles = require('./supportingFiles')
const Manuscript = require('./manuscript')

const getSubmissionUseCase = require('./getSubmissionUseCase')
const updateSubmissionUseCase = require('./updateSubmissionUseCase')

module.exports = {
  getSubmissionUseCase,
  updateSubmissionUseCase,
  SupportingFiles,
  Manuscript,
}
