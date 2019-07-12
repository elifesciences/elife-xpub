const { uniqBy } = require('lodash')

const makeResponseObject = answers =>
  uniqBy(answers, ans => ans.questionId).reduce(
    (acc, { questionId, text, answer }) => ({
      questions: [
        ...(acc.questions || []),
        {
          id: questionId,
          question: text,
        },
      ],
      answers: [
        ...(acc.answers || []),
        {
          questionId,
          answer,
        },
      ],
    }),

    {},
  )

const useCase = async (
  { SurveyResponse },
  { surveyId, answers, submissionId, userId },
) => {
  const response = makeResponseObject(answers)

  const surveyResponse = new SurveyResponse({
    surveyId,
    manuscriptId: submissionId,
    response,
  })

  try {
    await surveyResponse.save()
    return true
  } catch (e) {
    throw e
  }
}

module.exports = { useCase, makeResponseObject }
