// Value Objects

export interface Answer {
  answerId: string
  questionId: string
  text: string
}

export interface TextAnswer extends Answer {
  kind: 'TextAnswer'
  content: string
}

export interface MultipleChoiceAnswer extends Answer {
  kind: 'MultipleChoiceAnswer'
  choices: string[]
}

export interface Question {
  questionId: string
  text: string
}

export interface TextQuestion extends Question {
  kind: 'TextQuestion'
  validate: (value: string) => boolean
}

export interface MultipleChoiceQuestion extends Question {
  kind: 'MultipleChoiceQuestion'
  validAnswers: string[]
  validate: (value: string[]) => boolean
}

// Entities

export interface SurveyAnswers {
  id: string
  userId: string
  manuscriptId: string

  answers: Answer[]
}

// Aggregate Root

export interface Survey {
  kind: 'Survey'
  id: string
  questions: Question[]
}
