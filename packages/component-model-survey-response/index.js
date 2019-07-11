const fs = require('fs')
const path = require('path')

const SurveyResponse = require('./entities/surveyResponse')

module.exports = {
  model: SurveyResponse,
  modelName: 'SurveyResponse',
  typeDefs: fs.readFileSync(path.join(__dirname, '/typeDefs.graphqls'), 'utf8'),
}
