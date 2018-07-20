import yup from 'yup'

// TODO only the initially displayed fields should be required,
// fields added by the user should be optional

// TODO validate and display errors if wrong number of editors selected
const editorValidator = () => yup.array()

const suggestedReviewerValidator = () =>
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
  suggestedSeniorEditors: editorValidator(),
  opposedSeniorEditors: editorValidator(),
  // TODO conditionally required
  opposedSeniorEditorsReason: yup.string(),
  suggestedReviewingEditors: editorValidator(),
  opposedReviewingEditors: editorValidator(),
  oppopposedSeniorEditorsReason: yup.string(),
  suggestedReviewers: suggestedReviewerValidator(),
  opposedReviewers: opposedReviewerValidator(),
  noConflictOfInterest: yup
    .bool()
    .required()
    .oneOf(
      [true],
      'Please do not suggest people with a known confilct of interest',
    ),
})

export { schema }
