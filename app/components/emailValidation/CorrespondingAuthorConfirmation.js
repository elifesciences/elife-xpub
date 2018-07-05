import React from 'react'
import { Flex, Box } from 'grid-styled'
import { Heading } from '@pubsweet/ui'

const CorrespondingAuthorConfirmation = ({ location }) => (
  <Flex>
    <Box>
      <Heading level={1}>Thank you!</Heading>
      <p>You have been listed as the corresponding author for [title].</p>
    </Box>
  </Flex>
)

export default CorrespondingAuthorConfirmation
