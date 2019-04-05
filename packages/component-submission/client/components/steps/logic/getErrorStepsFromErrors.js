export const stepName = {
  AUTHOR: 'Author',
  DISCLOSURE: 'Disclosure',
  EDITORS: 'Editors',
  FILES: 'Files',
  SUBMISSION: 'Submission',
}
export const fieldToStepMap = {
  author: stepName.AUTHOR,
  cosubmission: stepName.SUBMISSION,
  coverLetter: stepName.FILES,
  disclosureConsent: stepName.DISCLOSURE,
  fileStatus: stepName.FILES,
  files: stepName.FILES,
  firstCosubmissionTitle: stepName.SUBMISSION,
  meta: stepName.SUBMISSION,
  opposedReviewers: stepName.EDITORS,
  opposedReviewersReason: stepName.EDITORS,
  opposedReviewingEditors: stepName.EDITORS,
  opposedReviewingEditorsReason: stepName.EDITORS,
  opposedSeniorEditors: stepName.EDITORS,
  opposedSeniorEditorsReason: stepName.EDITORS,
  previouslyDiscussed: stepName.SUBMISSION,
  previouslySubmitted: stepName.SUBMISSION,
  secondCosubmissionTitle: stepName.SUBMISSION,
  submitterSignature: stepName.DISCLOSURE,
  suggestedReviewers: stepName.EDITORS,
  suggestedReviewingEditors: stepName.EDITORS,
  suggestedSeniorEditors: stepName.EDITORS,
}

export const getStepFromFieldName = fieldName => fieldToStepMap[fieldName]

export const getErrorStepsFromErrors = (errorObject = {}) => {
  const steps = Object.keys(errorObject).map(fieldName =>
    getStepFromFieldName(fieldName),
  )
  return [...new Set(steps)]
}
