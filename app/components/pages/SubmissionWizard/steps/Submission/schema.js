import * as yup from 'yup'

const schema = yup.object().shape({
  meta: yup.object().shape({
    title: yup.string().required('Title is required'),
    articleType: yup.string().required('Article type is required'),
    subjects: yup
      .array()
      .min(1, `Choose at least 1 subject area`)
      .max(2, `No more than 2 subject areas`)
      .required('Subject area(s) required'),
  }),
  previouslyDiscussed: yup
    .string()
    .notOneOf(['', undefined], 'Please describe your previous discussion')
    .nullable(),
  previouslySubmitted: yup.array(
    yup
      .string()
      .notOneOf([''], 'Article title is required')
      .nullable(),
  ),
  firstCosubmissionTitle: yup
    .string()
    .notOneOf(['', undefined], 'Article title is required')
    .nullable(),
})

export { schema }
