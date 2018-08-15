import * as yup from 'yup'

const firstName = () => yup.string().required('First name is required')
const lastName = () => yup.string().required('Last name is required')

const email = () =>
  yup
    .string()
    .required('Email is required')
    .email('Must be a valid email address')

const institution = () => yup.string().required('Institution is required')

const schema = yup.object().shape({
  author: yup.object().shape({
    firstName: firstName(),
    lastName: lastName(),
    email: email(),
    aff: institution(),
  }),
})

export { schema }
