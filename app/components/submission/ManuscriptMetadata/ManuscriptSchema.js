import yup from 'yup'

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  metadata: yup.object().shape({
    articleType: yup.string().required('Article type is required'),
    discussedPreviously: yup.bool(),
  }),
})

const empty = {
  title: '',
  metadata: {
    articleType: '',
    discussedPreviously: false,
  },
}

export { schema, empty }
