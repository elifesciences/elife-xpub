import { SurveyId } from './branded'

export type Survey = {
  surveyId: SurveyId
  name: string
  description: string
}

export type SurveyDto = {
  surveyId: string
  name: string
  description: string
}

export type SurveyStorage = {
  save: (s: SurveyDto) => Promise<boolean>
  get: (id: SurveyId) => Promise<SurveyDto>
}

export interface SurveyRepositoryInterface {
  save: (survey: Survey) => Promise<boolean>
  getById: (id: SurveyId) => Promise<Survey>
}
