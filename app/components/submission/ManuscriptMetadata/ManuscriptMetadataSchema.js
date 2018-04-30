import yup from 'yup'

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  metadata: yup.object().shape({
    articleType: yup.string().required('Article type is required'),
    discussedPreviously: yup.bool(),
    discussion: yup.string().when('discussedPreviously', {
      is: true,
      then: yup.string().required('Please describe your previous discussion'),
    }),
    consideredPreviously: yup.bool(),
    previousArticle: yup.string().when('consideredPreviously', {
      is: true,
      then: yup.string().required('Article title/reference no. is required'),
    }),
    cosubmission: yup.bool(),
    cosubmissionTitle: yup
      .string()
      .test('namehere', 'Article title/reference no. is required', function(
        value,
      ) {
        const { cosubmission, cosubmissionId } = this.parent
        return cosubmission && (value || cosubmissionId)
      }),
    cosubmissionId: yup
      .string()
      .test('namehere', 'Article title/reference no. is required', function(
        value,
      ) {
        const { cosubmission, cosubmissionTitle } = this.parent
        return cosubmission && (value || cosubmissionTitle)
      }),
  }),
})

const empty = {
  title: '',
  metadata: {
    articleType: '',
    discussedPreviously: false,
    discussion: '',
    consideredPreviously: false,
    previousArticle: '',
    cosubmission: false,
    cosubmissionTitle: '',
    cosubmissionId: '',
  },
}

export { schema, empty }
