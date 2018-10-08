/* eslint-disable no-param-reassign */
/*
 * Data Modifiers -
 *    CosubmissionModifier
 *
 * These classes provide a common interface for the main class
 * 'SubmissionOperations' to delegate transforming the data model to the
 * view model.
 */
export default class CosubmissionModifier {
  omitList = () => ['firstCosubmissionTitle', 'secondCosubmissionTitle']

  toForm = values => {
    const { cosubmission } = values

    const cosubLen = cosubmission.length
    if (cosubLen) {
      values.firstCosubmissionTitle = cosubmission[0]
    } else {
      values.firstCosubmissionTitle = null
    }

    if (cosubLen > 1) {
      values.secondCosubmissionTitle = cosubmission[1]
    } else {
      values.secondCosubmissionTitle = null
    }
  }

  fromForm = (values, originalValues) => {
    const first = originalValues.firstCosubmissionTitle
    const second = originalValues.secondCosubmissionTitle
    values.cosubmission = []

    if (typeof first === 'string' && first.length) {
      values.cosubmission.push(first)

      if (typeof second === 'string' && second.length) {
        values.cosubmission.push(second)
      }
    }
  }
}
