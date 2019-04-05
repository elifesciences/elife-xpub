import * as yup from 'yup'
import { yupToFormErrors } from 'formik'

import { disclosurePageSchemaInner } from './schema'

const schema = yup.object().shape(disclosurePageSchemaInner)

describe('Disclosure page validation', () => {
  it('allows valid data', () => {
    const validData = {
      submitterSignature: 'Jo Franchetti',
      disclosureConsent: true,
    }
    expect(() => schema.validateSync(validData)).not.toThrow()
  })

  it('registers empty name as invalid', () => {
    const invalidData = {
      submitterSignature: '',
      disclosureConsent: true,
    }

    let errors
    try {
      schema.validateSync(invalidData, { abortEarly: false })
    } catch (e) {
      errors = yupToFormErrors(e)
    }

    expect(errors).toEqual({ submitterSignature: 'Your name is required' })
  })

  it('registers an unchecked consent box as invalid', () => {
    const invalidData = {
      submitterSignature: 'Jo Franchetti',
      disclosureConsent: false,
    }

    let errors
    try {
      schema.validateSync(invalidData, { abortEarly: false })
    } catch (e) {
      errors = yupToFormErrors(e)
    }

    expect(errors).toEqual({
      disclosureConsent: 'We are unable to proceed without your consent',
    })
  })
})
