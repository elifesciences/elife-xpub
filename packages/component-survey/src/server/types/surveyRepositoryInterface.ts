import { SurveyId } from './branded'
import { Survey } from './survey'

export interface SurveyRepositoryInterface {
  save: (survey: Survey) => Promise<boolean>
  getById: (id: SurveyId) => Promise<Survey>
}
