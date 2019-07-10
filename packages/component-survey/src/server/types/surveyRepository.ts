import { SurveyId } from './branded'
import { Survey } from './survey'

export interface surveyRepository {
  save: (u: Survey) => Promise<Survey>
  getById: (id: SurveyId) => Promise<Survey>
}
