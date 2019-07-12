const SupportingFiles = require('./supportingFiles')
const Manuscript = require('./manuscript')

const getSubmissionUseCase = require('./getSubmissionUseCase')
const updateSubmissionUseCase = require('./updateSubmissionUseCase')
const submitSurveyUseCase = require('./submitSurveyUseCase').useCase

module.exports = {
  getSubmissionUseCase,
  updateSubmissionUseCase,
  SupportingFiles,
  submitSurveyUseCase,
  Manuscript,
}
