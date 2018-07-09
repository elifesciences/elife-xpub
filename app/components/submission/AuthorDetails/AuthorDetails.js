import React from 'react'
import { Action, ErrorText } from '@pubsweet/ui'
import ValidatedField from '../../ui/atoms/ValidatedField'
import TwoColumnRow from '../TwoColumnRow'

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

    <TwoColumnRow
      left={
        <ValidatedField
          label="First name"
          name="submissionMeta.author.firstName"
        />
      }
      right={
        <ValidatedField
          label="Last name"
          name="submissionMeta.author.lastName"
        />
      }
    />
    <TwoColumnRow
      left={
        <ValidatedField
          label="Email (correspondence)"
          name="submissionMeta.author.email"
          type="email"
        />
      }
      right={
        <ValidatedField
          label="Institution"
          name="submissionMeta.author.institution"
        />
      }
    />
  </React.Fragment>
)

export default AuthorDetails
