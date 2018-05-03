import yup from 'yup'

const firstName = () => yup.string().required('First name is required')
const lastName = () => yup.string().required('Last name is required')

const email = () =>
  yup
    .string()
    .required('Email is required')
    .email('Must be a valid email address')

const institution = () => yup.string().required('Institution is required')

const author = () =>
  yup.object().shape({
    firstName: firstName(),
    lastName: lastName(),
    email: email(),
    institution: institution(),
  })

const schema = yup.object().shape({
  submissionMeta: yup.object().shape({
    hasCorrespondent: yup.boolean(),
    author: author(),
    correspondent: yup.object().when('hasCorrespondent', {
      is: true,
      then: author(),
    }),
  }),
})

const emptyPerson = {
  firstName: '',
  lastName: '',
  email: '',
  institution: '',
}
/*
const clientStateConfig = {
  resolvers: {
    Mutation: {
      updateSubmissionLocal: (_, { input }, { cache }) => {
        cache.writeData({ data: { currentSubmission: input } })
        return null
      },
    },
  },
}
*/
export { schema, emptyPerson }
