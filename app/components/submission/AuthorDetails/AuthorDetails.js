import React from 'react'
import { Flex, Box } from 'grid-styled'
import { Action, ErrorText } from '@pubsweet/ui'
import ValidatedField from '../../ui/atoms/ValidatedField'

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

    <Flex>
      <Box width={1 / 2}>
        <ValidatedField
          label="First name"
          name="submissionMeta.author.firstName"
        />
      </Box>
      <Box width={1 / 2}>
        <ValidatedField
          label="Last name"
          name="submissionMeta.author.lastName"
        />
      </Box>
    </Flex>
    <Flex>
      <Box width={1 / 2}>
        <ValidatedField
          label="Email (correspondence)"
          name="submissionMeta.author.email"
          type="email"
        />
      </Box>
      <Box width={1 / 2}>
        <ValidatedField
          label="Institution"
          name="submissionMeta.author.institution"
        />
      </Box>
    </Flex>
  </React.Fragment>
)

export default AuthorDetails
