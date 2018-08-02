/* eslint-disable no-template-curly-in-string */
import yup from 'yup'
import './SuggestedReviewersValidator'

// TODO only the initially displayed fields should be required,
// fields added by the user should be optional

const limits = {
  suggestedSeniorEditors: { min: 2, max: 2 },
  opposedSeniorEditors: { min: 0, max: 2 },
  suggestedReviewingEditors: { min: 2, max: 2 },
  opposedReviewingEditors: { min: 0, max: 2 },
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
yup.array(
  yup.object({
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .email('Must be a valid email')
      .required('Email is required'),
  }),
)

const opposedReviewerValidator = () =>
  yup.array(
    yup.object({
      name: yup.string().required('Name is required'),
      email: yup
        .string()
        .email('Must be a valid email')
        .required('Email is required'),
      reason: yup.string().required('Required'),
    }),
  )

const schema = yup.object().shape({
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
  noConflictOfInterest: yup
    .bool()
    .required()
    .oneOf(
      [true],
      'Please do not suggest people with a known conflict of interest',
    ),
})

export { schema, limits }
