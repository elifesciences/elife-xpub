const { createTables } = require('@elifesciences/component-model')
const uuid = require('uuid')
const SurveyResponse = require('.')
const replaySetup = require('../../../../test/helpers/replay-setup')

replaySetup('success')

const createSurveyResponse = params =>
  new SurveyResponse({
    response: params || {
      questions: [
        {
          id: '1',
          question: 'Question 1',
        },
      ],
      answers: [
        {
          questionId: '1',
          answer: 'Answer 1',
        },
      ],
    },
    manuscriptId: uuid(),
    surveyId: 'survey_id',
  }).save()

describe('AuditLog', () => {
  beforeEach(async () => {
    await createTables(true)
  })

  it('should save to the database', async () => {
    const surveyResponse = await createSurveyResponse()
    expect(surveyResponse.id).toBeTruthy()
  })

  describe('delete', () => {
    it('if should throw an unsupported error', async () => {
      const surveyResponse = await createSurveyResponse()
      const error = new Error('Unsupported operation')
      let response
      try {
        response = await surveyResponse.delete()
      } catch (err) {
        response = err
      }
      expect(response).toEqual(error)
    })
  })
})
