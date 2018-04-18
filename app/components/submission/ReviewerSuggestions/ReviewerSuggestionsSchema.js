import yup from 'yup'

// TODO only the initially displayed fields should be required,
// fields added by the user should be optional

const suggestedEditorValidator = () =>
  yup.array(yup.string().required('Required'))

const opposedEditorValidator = () =>
  yup.array(
    yup.object({
      name: yup.string().required('Required'),
      reason: yup.string().required('Required'),
    }),
  )

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
  suggestedSeniorEditors: suggestedEditorValidator(),
  opposedSeniorEditors: opposedEditorValidator(),
  suggestedReviewingEditors: suggestedEditorValidator(),
  opposedReviewingEditors: opposedEditorValidator(),
  suggestedReviewers: suggestedReviewerValidator(),
  opposedReviewers: opposedReviewerValidator(),
  declaration: yup
    .bool()
    .required()
    .oneOf(
      [true],
      'Please do not suggest people with a known confilct of interest',
    ),
})

const empty = {
  suggestedSeniorEditors: ['', ''],
  opposedSeniorEditors: [],
  suggestedReviewingEditors: ['', ''],
  opposedReviewingEditors: [],
  suggestedReviewers: [
    { name: '', email: '' },
    { name: '', email: '' },
    { name: '', email: '' },
  ],
  opposedReviewers: [],
  declaration: false,
}

export { schema, empty }
