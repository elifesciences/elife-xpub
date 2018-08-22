import * as yup from 'yup'

const schema = yup.object().shape({
  submitterSignature: yup.string().required('Your name is required'),
  disclosureConsent: yup
    .bool()
    .required()
    .oneOf([true], 'Your consent is required for submission'),
})

export { schema }
