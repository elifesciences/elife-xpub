import { SurveyId, SurveyDto, SurveyStorage } from '../../types'

/*
 * Responsibility: Takes the DTO that is made by the domain and saves it
 */

export class PostgresSurveyRepository implements SurveyStorage {
  connection: any
  constructor(connection: any) {
    this.connection = connection
  }

  save(surveyDto: SurveyDto) {
    return this.connection('survey').insert(surveyDto)
  }
  get(id: SurveyId) {
    return this.connection('survey')
      .select('')
      .where('id', '=', SurveyId.fromBranded(id))
  }
}
