/*
 *
 */

// Turns out that the db object from pubsweet is the knex client
// So if you : insert into survey values ('551e8905-7680-4ba3-925c-c1bf5f89ffc4', now(), now(), 'bob', 'test');
// then you can:
// const { db } = require('@pubsweet/db-manager')
// db('survey').select('name').where('id', '=', '551e8905-7680-4ba3-925c-c1bf5f89ffc4').then( result => console.log("........", result))
//
import {
  Survey,
  SurveyRepositoryInterface,
  SurveyId,
  SurveyDto,
} from '../../types'
import { db } from '@pubsweet/db-manager'
import { PostgresSurveyRepository } from '../../infrastructure/data-access/pgSurveyRepository'

const theOnlySurvey: Survey = {
  surveyId: SurveyId.toBranded('ec51f40d-5714-4b60-9d99-2b274bc17166'),
  name: 'Demographic Survey',
  description: 'Survey to gather demographic information on last author',
}

export class SurveyRepository implements SurveyRepositoryInterface {
  save(survey: Survey) {
    const connection = new PostgresSurveyRepository(db)
    // need to convert to a dto
    const dto: SurveyDto = {
      surveyId: SurveyId.fromBranded(survey.surveyId),
      name: survey.name,
      description: survey.description,
    }
    return connection.save(dto)
  }

  getById(id: SurveyId) {
    return Promise.resolve(theOnlySurvey)
  }
}
