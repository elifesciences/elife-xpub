import yup from 'yup'

const firstName = () => yup.string().required('First name is required')
const lastName = () => yup.string().required('Last name is required')

const email = () =>
  yup
    .string()
    .required('Email is required')
    .email('Must be a valid email address')

const institute = () => yup.string().required('Institute is required')

const schema = yup.object().shape({
  firstName: firstName(),
  lastName: lastName(),
  email: email(),
  institute: institute(),
  assignee: yup
    .object()
    .nullable()
    .shape({
      firstName: firstName(),
      lastName: lastName(),
      email: email(),
    }),
})

const empty = {
  __typename: 'Submission',
  firstName: '',
  lastName: '',
  email: '',
  institute: '',
  assignee: null,
}

const emptyAssignee = {
  __typename: 'Assignee',
  firstName: '',
  lastName: '',
  email: '',
}

const clientStateConfig = {
  resolvers: {
    Mutation: {
      updateCurrentSubmission: (_, { input }, { cache }) => {
        cache.writeData({ data: { currentSubmission: input } })
        return null
      },
    },
  },
  defaults: {
    currentSubmission: empty,
  },
}

export { schema, empty, emptyAssignee, clientStateConfig }
