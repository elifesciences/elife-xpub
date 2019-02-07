import React from 'react'
import ActionText from 'ui/atoms/ActionText'
import ValidatedField from 'ui/atoms/ValidatedField'
import TwoColumnLayout from 'global/layout/TwoColumnLayout'

const AuthorPage = ({ prefill }) => (
  <React.Fragment>
    <p>
      <ActionText data-test-id="orcid-prefill" onClick={prefill}>
        Pre-fill my details
      </ActionText>{' '}
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
