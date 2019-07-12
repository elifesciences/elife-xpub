const { submitSurveyUseCase } = require('../use-cases')
const SurveyResponse = require('@elifesciences/component-model-survey-response')
  .model
const config = require('config')

async function submitSurveyResponse(_, { data }, { user: userId }) {
  const { surveyId, submissionId, answers } = data

  try {
    return await submitSurveyUseCase(
      { SurveyResponse },
      {
        surveyId,
        submissionId,
        answers,
        userId,
      },
    )
  } catch (e) {
    throw e
  }
}

module.exports =
  config.has('features.demographicSurvey') &&
  config.get('features.demographicSurvey')
    ? submitSurveyResponse
    : async () => false
