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
