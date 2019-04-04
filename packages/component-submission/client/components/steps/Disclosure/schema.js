import * as yup from 'yup'
import authorPageSchema from '../Author/schema'
import filesPageSchema from '../Files/schema'
import submissionPageSchema from '../Submission/schema'
import editorsPageSchema from '../Editors/schema'

export const disclosurePageSchemaInner = {
  submitterSignature: yup.string().required('Your name is required'),
  disclosureConsent: yup
    .bool()
    .required()
    .oneOf([true], 'We are unable to proceed without your consent'),
}

const disclosurePageSchema = {
  ...authorPageSchema,
  ...filesPageSchema,
  ...submissionPageSchema,
  ...editorsPageSchema,
  ...disclosurePageSchemaInner,
}

export default disclosurePageSchema
