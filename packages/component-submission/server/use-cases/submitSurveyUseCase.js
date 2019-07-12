const { uniqBy, pick } = require('lodash')

const makeResponseObject = answers =>
  uniqBy(answers, ans => ans.questionId).reduce(
    (acc, question) => ({
      questions: [
        ...(acc.questions || []),
        pick(question, ['questionId', 'text']),
      ],
      answers: [
        ...(acc.answers || []),
        pick(question, ['questionId', 'answer']),
      ],
    }),

    {},
  )

const useCase = ({ Survey }, { surveyId, answers, submissionId, userId }) => {
  const response = makeResponseObject(answers)

  const surveyResponse = new Survey({
    surveyId,
    manuscriptId: submissionId,
    response,
  })

  surveyResponse.save()
  return true
}

module.exports = { useCase, makeResponseObject }
