const SupportingFiles = require('./supportingFiles')
const Manuscript = require('./manuscript')
const S3Storage = require('./client/s3Storage')
const ScienceBeamApi = require('../xpub-client/scienceBeamApi')

module.exports = {
  SupportingFiles,
  Manuscript,
  S3Storage,
  ScienceBeamApi,
}
