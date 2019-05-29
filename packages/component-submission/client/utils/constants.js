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

export const STEP_NAMES = {
  AUTHOR: 'Author',
  FILES: 'Files',
  DETAILS: 'Details',
  EDITORS: 'Editors',
  DISCLOSURE: 'Disclosure',
}

export const FIELD_TO_STEP_MAP = {
  author: STEP_NAMES.AUTHOR,
  cosubmission: STEP_NAMES.DETAILS,
  coverLetter: STEP_NAMES.FILES,
  disclosureConsent: STEP_NAMES.DISCLOSURE,
  fileStatus: STEP_NAMES.FILES,
  files: STEP_NAMES.FILES,
  firstCosubmissionTitle: STEP_NAMES.DETAILS,
  meta: STEP_NAMES.DETAILS,
  opposedReviewers: STEP_NAMES.EDITORS,
  opposedReviewersReason: STEP_NAMES.EDITORS,
  opposedReviewingEditors: STEP_NAMES.EDITORS,
  opposedReviewingEditorsReason: STEP_NAMES.EDITORS,
  opposedSeniorEditors: STEP_NAMES.EDITORS,
  opposedSeniorEditorsReason: STEP_NAMES.EDITORS,
  previouslyDiscussed: STEP_NAMES.DETAILS,
  previouslySubmitted: STEP_NAMES.DETAILS,
  secondCosubmissionTitle: STEP_NAMES.DETAILS,
  submitterSignature: STEP_NAMES.DISCLOSURE,
  suggestedReviewers: STEP_NAMES.EDITORS,
  suggestedReviewingEditors: STEP_NAMES.EDITORS,
  suggestedSeniorEditors: STEP_NAMES.EDITORS,
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
