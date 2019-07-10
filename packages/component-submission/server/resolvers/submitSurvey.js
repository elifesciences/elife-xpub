// submit survey resolver -- calls the usecase
const { submitSurveyUseCase } = require('../use-cases')
const config = require('config')

async function submitSurvey(_, data, { user }) {
  const { surveyId, submissionId, answers } = data

  console.log(surveyId, submissionId, answers)

  try {
    // submitSurvey
    return submitSurveyUseCase(null, { surveyId, submissionId, answers, user })
  } catch (e) {
    throw e
  }
}

module.exports =
  config.has('features.demographicSurvey') &&
  config.get('features.demographicSurvey')
    ? submitSurvey
    : async () => false
