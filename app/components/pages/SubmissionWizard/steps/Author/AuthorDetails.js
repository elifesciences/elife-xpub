import React from 'react'
import { Action, ErrorText } from '@pubsweet/ui'
import ValidatedField from '../../../../ui/atoms/ValidatedField'
import TwoColumnLayout from '../../../../global/layout/TwoColumnLayout'

const AuthorDetails = ({ fetchOrcid, loading, error }) => (
  <React.Fragment>
    <p>
      <Action data-test-id="orcid-prefill" onClick={fetchOrcid}>
        Pre-fill my details
      </Action>{' '}
      using ORCiD
      {loading && ' Loading...'}
    </p>
    <ErrorText data-test-id="orcid-error" role="status">
      {error}
    </ErrorText>

    <TwoColumnLayout bottomSpacing={false}>
      <ValidatedField
        label="First name"
        name="submissionMeta.author.firstName"
      />
      <ValidatedField label="Last name" name="submissionMeta.author.lastName" />
      <ValidatedField
        label="Email (correspondence)"
        name="submissionMeta.author.email"
        type="email"
      />
      <ValidatedField
        label="Institution"
        name="submissionMeta.author.institution"
      />
    </TwoColumnLayout>
  </React.Fragment>
)

export default AuthorDetails
