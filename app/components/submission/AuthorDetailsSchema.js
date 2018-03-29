import yup from 'yup'

const firstName = () => yup.string().required('First name is required')
const lastName = () => yup.string().required('Last name is required')

const email = () =>
  yup
    .string()
    .required('Email is required')
    .email('Must be a valid email address')

const institute = () => yup.string().required('Institute is required')

export default yup.object().shape({
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
