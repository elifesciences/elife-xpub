/*
 * Data Modifiers -
 *    CosubmissionModifier
 *
 * These classes provide a common interface for the main class
 * 'WithCurrentSubmission' to delgate transforming the data model to the
 * view model.
 */
export default class CosubmissionModifier {
  omitList = () => [
    'submissionMeta.firstCosubmissionTitle',
    'submissionMeta.secondCosubmissionTitle',
  ]

  toForm = values => {
    const { submissionMeta } = values
    const { cosubmission } = submissionMeta

    const cosubLen = cosubmission.length
    if (cosubLen) {
      submissionMeta.firstCosubmissionTitle = cosubmission[0].title
    } else {
      submissionMeta.firstCosubmissionTitle = null
    }

    if (cosubLen > 1) {
      submissionMeta.secondCosubmissionTitle = cosubmission[1].title
    } else {
      submissionMeta.secondCosubmissionTitle = null
    }
  }

  fromForm = (values, originalValues) => {
    const { submissionMeta } = values
    const first = originalValues.submissionMeta.firstCosubmissionTitle
    const second = originalValues.submissionMeta.secondCosubmissionTitle
    submissionMeta.cosubmission = []

    if (typeof first === 'string' && first.length) {
      submissionMeta.cosubmission.push({ title: first })

      if (typeof second === 'string' && second.length) {
        submissionMeta.cosubmission.push({ title: second })
      }
    }
  }
}
