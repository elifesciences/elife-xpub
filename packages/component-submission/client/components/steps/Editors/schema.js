/* eslint-disable no-template-curly-in-string */
import * as yup from 'yup'
import { suggestedReviewersLimits } from './SuggestedReviewersValidator'

// TODO only the initially displayed fields should be required,
// fields added by the user should be optional

export const limits = {
  suggestedSeniorEditors: { min: 2, max: 6 },
  opposedSeniorEditors: { min: 0, max: 1 },
  suggestedReviewingEditors: { min: 2, max: 6 },
  opposedReviewingEditors: { min: 0, max: 2 },
  suggestedReviewers: {
    min: suggestedReviewersLimits.min,
    max: suggestedReviewersLimits.max,
  },
}

const editorValidator = key =>
  yup
    .array()
    .min(limits[key].min, 'Please suggest at least ${min} editors')
    .max(limits[key].max, 'Please suggest no more than ${max} editors')

const opposedReasonValidator = key =>
  yup.string().when(key, {
    is: editors => !!editors.length,
    then: yup.string().required('Please provide a reason for exclusion'),
  })

const suggestedReviewerValidator = () => yup.array().validReviewers()

const opposedReviewerValidator = () =>
  yup.array(
    yup.object({
      name: yup.string().required('Name is required'),
      email: yup
        .string()
        .email('Must be a valid email')
        .required('Email is required'),
    }),
  )

const editorsPageSchema = {
  suggestedSeniorEditors: editorValidator('suggestedSeniorEditors'),
  opposedSeniorEditors: editorValidator('opposedSeniorEditors'),
  opposedSeniorEditorsReason: opposedReasonValidator('opposedSeniorEditors'),
  suggestedReviewingEditors: editorValidator('suggestedReviewingEditors'),
  opposedReviewingEditors: editorValidator('opposedReviewingEditors'),
  opposedReviewingEditorsReason: opposedReasonValidator(
    'opposedReviewingEditors',
  ),
  suggestedReviewers: suggestedReviewerValidator(),
  opposedReviewers: opposedReviewerValidator(),
  opposedReviewersReason: opposedReasonValidator('opposedReviewers'),
}

export default editorsPageSchema
