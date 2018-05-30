import React from 'react'
import { Flex, Box } from 'grid-styled'
import { Button, H1, Action, ErrorText } from '@pubsweet/ui'
import ValidatedField from '../../ui/atoms/ValidatedField'
import ProgressBar from '../ProgressBar'

const AuthorDetails = ({ handleSubmit, fetchOrcid, loading, error }) => (
  <form noValidate onSubmit={handleSubmit}>
    <ProgressBar currentStep={0} />

    <H1>Who is the corresponding author?</H1>

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

    <Flex>
      <Box width={1}>
        <Button data-test-id="next" primary type="submit">
          Next
        </Button>
      </Box>
    </Flex>
  </form>
)

export default AuthorDetails
