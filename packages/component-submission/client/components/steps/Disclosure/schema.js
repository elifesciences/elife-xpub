import * as yup from 'yup'

const disclosurePageSchema = {
  submitterSignature: yup.string().required('Your name is required'),
  disclosureConsent: yup
    .bool()
    .required()
    .oneOf([true], 'We are unable to proceed without your consent'),
}

export default disclosurePageSchema
