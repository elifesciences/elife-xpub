const { submitSurveyUseCase } = require('../use-cases')
const config = require('config')

async function submitSurvey(_, { data }, { user: userId }) {
  const { surveyId, submissionId, answers } = data

  console.log(surveyId, submissionId, answers, userId)

  try {
    return submitSurveyUseCase(null, {
      surveyId,
      submissionId,
      answers,
      userId,
    })
  } catch (e) {
    throw e
  }
}

module.exports =
  config.has('features.demographicSurvey') &&
  config.get('features.demographicSurvey')
    ? submitSurvey
    : async () => false
