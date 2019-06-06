import config from 'config'

export const MAX_SUPPORTING_FILES = 10
export const MAX_FILE_SIZE = config.fileUpload.maxSizeMB
export const MIN_COVERLETTER_WORDS = 60

export const EDITOR_LIMITS = {
  suggestedSeniorEditors: { min: 2, max: 6 },
  opposedSeniorEditors: { min: 0, max: 1 },
  suggestedReviewingEditors: { min: 2, max: 6 },
  opposedReviewingEditors: { min: 0, max: 2 },
  suggestedReviewers: { min: 0, max: 6 },
}

export const errorMessageMapping = {
  EMPTY: 'Please upload a manuscript.',
  MULTIPLE: 'Only one file can be uploaded.',
  UNSUPPORTED: 'That file is not supported.',
  UPLOAD_FAILURE: 'There was a problem uploading your file.',
  MAX_SIZE_EXCEEDED: `Must be less than ${MAX_FILE_SIZE}MB`,
}

export const manuscriptFileTypes = {
  MANUSCRIPT_SOURCE: 'MANUSCRIPT_SOURCE',
  SUPPORTING_FILE: 'SUPPORTING_FILE',
}

export const STEP_NAMES = [
  'Author',
  'Files',
  'Details',
  'Editors',
  'Disclosure',
]

export const FIELD_TO_STEP_MAP = {
  author: STEP_NAMES[0],
  cosubmission: STEP_NAMES[2],
  coverLetter: STEP_NAMES[1],
  disclosureConsent: STEP_NAMES[4],
  fileStatus: STEP_NAMES[1],
  files: STEP_NAMES[1],
  firstCosubmissionTitle: STEP_NAMES[2],
  meta: STEP_NAMES[2],
  opposedReviewers: STEP_NAMES[3],
  opposedReviewersReason: STEP_NAMES[3],
  opposedReviewingEditors: STEP_NAMES[3],
  opposedReviewingEditorsReason: STEP_NAMES[3],
  opposedSeniorEditors: STEP_NAMES[3],
  opposedSeniorEditorsReason: STEP_NAMES[3],
  previouslyDiscussed: STEP_NAMES[2],
  previouslySubmitted: STEP_NAMES[2],
  secondCosubmissionTitle: STEP_NAMES[2],
  submitterSignature: STEP_NAMES[4],
  suggestedReviewers: STEP_NAMES[3],
  suggestedReviewingEditors: STEP_NAMES[3],
  suggestedSeniorEditors: STEP_NAMES[3],
}

export const FORM_FIELDS_TO_OMIT = [
  '__typename',
  'files',
  'teams',
  'status',
  'clientStatus',
  'fileStatus',
  // cosubmitters
  'firstCosubmissionTitle',
  'secondCosubmissionTitle',
]
