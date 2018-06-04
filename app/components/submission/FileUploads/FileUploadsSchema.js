import yup from 'yup'

const schema = yup.object().shape({
  submissionMeta: yup.object({
    coverLetter: yup.string().required('Cover letter is required'),
  }),
  files: yup.array().min(1, 'Please upload a manuscript'),
})

export { schema }
