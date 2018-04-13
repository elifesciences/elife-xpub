import yup from 'yup'

const email = () => yup.string().email('Must be a valid email address')

const schema = yup.object().shape({
  suggestedReviewerEmail: email(),
  excludedReviewerEmail: email(),
})

const empty = {
  suggestedEditors: '',
  excludedEditors: '',
  suggestedReviewerName: '',
  excludedReviewerName: '',
  suggestedReviewerEmail: '',
  excludedReviewerEmail: '',
}

export { schema, empty }
