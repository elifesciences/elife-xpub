const BaseModel = require('@pubsweet/base-model')

class SurveyResponse extends BaseModel {
  static get tableName() {
    return 'survey_response'
  }

  static get schema() {
    return {
      required: ['manuscriptId', 'surveyId', 'response'],
      properties: {
        manuscriptId: { type: 'uuid' },
        surveyId: { type: 'string' },
        response: {
          type: 'object',
          properties: {
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'uuid' },
                  question: { type: 'string' },
                },
              },
            },
            answers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  questionId: { type: 'uuid' },
                  answer: { type: 'string' },
                },
              },
            },
          },
        },
      },
    }
  }

  async delete() {
    throw new Error('Unsupported operation')
  }
}

module.exports = SurveyResponse
