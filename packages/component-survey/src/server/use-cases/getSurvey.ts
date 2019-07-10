/*
 * In-coming requests from an external interface get handled by the use-cases
 */

import { SurveyId } from '../types/branded'
import { SurveyRepository } from '../domain/repositories/surveyRepository'

const surveyRepository = new SurveyRepository()

export function getSurvey(id: SurveyId) {
  // create new pg repo with db from above
  return surveyRepository.getById(id)
}
