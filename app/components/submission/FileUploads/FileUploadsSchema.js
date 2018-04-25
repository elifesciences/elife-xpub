import yup from 'yup'

const schema = yup.object().shape({
  coverLetter: yup.string().required('Cover letter is required'),
  manuscriptUrl: yup.string().required('Please upload your manuscript'),
})

const empty = {
  coverLetter: '',
  manuscriptUrl: '',
}

export { schema, empty }
