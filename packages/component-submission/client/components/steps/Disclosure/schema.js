import * as yup from 'yup'
import authorPageSchema from '../Author/schema'
import filesPageSchema from '../Files/schema'
import submissionPageSchema from '../Submission/schema'
import editorsPageSchema from '../Editors/schema'

const disclosurePageSchema = {
  ...authorPageSchema,
  ...filesPageSchema,
  ...submissionPageSchema,
  ...editorsPageSchema,
  submitterSignature: yup.string().required('Your name is required'),
  disclosureConsent: yup
    .bool()
    .required()
    .oneOf([true], 'We are unable to proceed without your consent'),
}

export default disclosurePageSchema
