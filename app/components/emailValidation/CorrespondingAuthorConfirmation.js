import React from 'react'
import { Flex, Box } from 'grid-styled'
import { Heading } from '@pubsweet/ui'
import LoginButton from '@pubsweet-pending/login-orcid/Login'

const CorrespondingAuthorConfirmation = ({ location }) => (
  <Flex>
    <Box>
      <Heading level={1}>Thank you!</Heading>
      <p>
        You have been listed as the corresponding author for [title]. To track
        the progress of this submission, please log in below.
      </p>
      <LoginButton location={location} />
    </Box>
  </Flex>
)

export default CorrespondingAuthorConfirmation
