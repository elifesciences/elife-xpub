import React from 'react'
import { Action } from '@pubsweet/ui'
import ValidatedField from '../../../../ui/atoms/ValidatedField'
import TwoColumnLayout from '../../../../global/layout/TwoColumnLayout'

const AuthorPage = ({ prefill }) => (
  <React.Fragment>
    <p>
      <Action data-test-id="orcid-prefill" onClick={prefill}>
        Pre-fill my details
      </Action>{' '}
      using ORCID
    </p>

    <TwoColumnLayout bottomSpacing={false}>
      <ValidatedField label="First name" name="author.firstName" />
      <ValidatedField label="Last name" name="author.lastName" />
      <ValidatedField
        label="Email (correspondence)"
        name="author.email"
        type="email"
      />
      <ValidatedField label="Institution" name="author.aff" />
    </TwoColumnLayout>
  </React.Fragment>
)

export default AuthorPage
