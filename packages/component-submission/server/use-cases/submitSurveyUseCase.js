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

const useCase = (
  { SurveyResponse },
  { surveyId, answers, submissionId, userId },
) => {
  const response = makeResponseObject(answers)

  const surveyResponse = new SurveyResponse({
    surveyId,
    manuscriptId: submissionId,
    response,
  })

  surveyResponse.save()
  return true
}

module.exports = { useCase, makeResponseObject }
