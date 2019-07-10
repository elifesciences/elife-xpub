// Turns out that the db object from pubsweet is the knex client
// So if you : insert into survey values ('551e8905-7680-4ba3-925c-c1bf5f89ffc4', now(), now(), 'bob', 'test');
// then you can:
// const { db } = require('@pubsweet/db-manager')
// db('survey').select('name').where('id', '=', '551e8905-7680-4ba3-925c-c1bf5f89ffc4').then( result => console.log("........", result))
//
import { Survey, SurveyRepositoryInterface, SurveyId } from  '../../types'

const theOnlySurvey : Survey = {
  surveyId: SurveyId.toBranded('ec51f40d-5714-4b60-9d99-2b274bc17166'),
  name: 'Demographic Survey',
  description: 'Survey to gather demographic information on last author',
}

export class SurveyRepository implements SurveyRepositoryInterface {
  constructor(db) {
    this.db = db
  }

  save(survey: Survey) {
    throw "Not implemented"
    return Promise.resolve(false)
  }

  getById(id: SurveyId) {
    return Promise.resolve(theOnlySurvey)
  }

}
