import yup from 'yup'

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  manuscriptType: yup.string().required('Article type is required'),
  subjectAreas: yup
    .array()
    .min(1, `Choose at least 1 subject area`)
    .max(2, `No more than 2 subject areas`)
    .required('Subject area(s) required'),
  submissionMeta: yup.object().shape({
    discussion: yup
      .string()
      .notOneOf([''], 'Please describe your previous discussion')
      .nullable(),
    previousArticle: yup
      .string()
      .notOneOf([''], 'Article title is required')
      .nullable(),
    cosubmission: yup
      // validate the array as an object to allow different requirements at different positions
      .object({
        '0': yup.object().shape({
          title: yup.string().required('Article title is required'),
        }),
        '1': yup.object().shape({
          title: yup.string(),
        }),
      })
      // transform array to object for the purpose of validation
      .transform((_, originalValue) =>
        originalValue.reduce(
          (obj, value, index) => ({ ...obj, [index]: value }),
          {},
        ),
      ),
  }),
})

const empty = {
  title: '',
  manuscriptType: '',
  subjectAreas: [],
  submissionMeta: {
    discussion: null,
    previousArticle: null,
    cosubmission: [],
  },
}

export { schema, empty }
