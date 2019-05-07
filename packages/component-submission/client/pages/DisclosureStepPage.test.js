import React from 'react'
import { shallow } from 'enzyme'
import DisclosurePage from './DisclosureStepPage'

describe('DisclosurePage', () => {
  const values = {
    author: 'me',
    meta: {
      articleType: '',
    },
  }
  it('displays no error message when passed empty errors object', () => {
    const page = shallow(<DisclosurePage errors={{}} values={values} />)
    expect(page.find('[data-test-id="test-error-message"]')).toHaveLength(0)
  })

  it('displays error message when passed errors object and an attempt has been made to submit the form', () => {
    const errors = {
      submitterSignature: 'error',
    }
    const page = shallow(
      <DisclosurePage errors={errors} isSubmissionAttempted values={values} />,
    )
    expect(page.find('[data-test-id="test-error-message"]')).toHaveLength(1)
  })
})
