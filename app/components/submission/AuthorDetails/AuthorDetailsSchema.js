import yup from 'yup'

const firstName = () => yup.string().required('First name is required')
const lastName = () => yup.string().required('Last name is required')

const email = () =>
  yup
    .string()
    .required('Email is required')
    .email('Must be a valid email address')

const institution = () => yup.string().required('Institute is required')

const schema = yup.object().shape({
  submissionMeta: yup.object().shape({
    displayCorrespondent: yup.boolean(),
    author: yup.object().shape({
      firstName: firstName(),
      lastName: lastName(),
      email: email(),
      institution: institution(),
    }),
    correspondent: yup.object().shape({
      firstName: firstName(),
      lastName: lastName(),
      email: email(),
    }),
  }),
})

const empty = {
  __typename: 'Submission',
  firstName: '',
  lastName: '',
  email: '',
  institution: '',
  assignee: null,
}

const emptyAssignee = {
  __typename: 'Assignee',
  firstName: '',
  lastName: '',
  email: '',
  institution: '',
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
