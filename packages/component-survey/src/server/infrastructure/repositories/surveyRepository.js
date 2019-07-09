// Turns out that the db object from pubsweet is the knex client
// So if you : insert into survey values ('551e8905-7680-4ba3-925c-c1bf5f89ffc4', now(), now(), 'bob', 'test');
// then you can:
// const { db } = require('@pubsweet/db-manager')
// db('survey').select('name').where('id', '=', '551e8905-7680-4ba3-925c-c1bf5f89ffc4').then( result => console.log("........", result))
//
const theOnlySurvey = {
  id: 'ec51f40d-5714-4b60-9d99-2b274bc17166',
  name: 'Demographic Survey',
  description: 'Survey to gather demographic information on last author',
  questions: [
    {
      index: 0,
      question: 'What it the terminal air-velocity of an laden swallow?',
    },
  ],
}

export class SurveyRepository {
  constructor(db) {
    this.db = db
  }

  // eslint-disable-next-line class-methods-use-this
  async getSurvey(id) {
    return theOnlySurvey
  }

  // eslint-disable-next-line class-methods-use-this
  async getSurveyWithQuestions(id) {
    return theOnlySurvey
  }

  async addResponses(id, responses) {
    return this.db('survey_responses').insert({
      survey_id: id,
      responses,
    })
  }
}
