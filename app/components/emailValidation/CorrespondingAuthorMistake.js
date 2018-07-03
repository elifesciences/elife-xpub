import React from 'react'
import { Flex, Box } from 'grid-styled'
import { Heading, Button } from '@pubsweet/ui'

const CorrespondingAuthorMistake = () => (
  <Flex>
    <Box>
      <Heading level={1}>Thank you!</Heading>
      <p>You will not be listed as the corresponding author for [title].</p>
      <Button>Made a mistake?</Button>
    </Box>
  </Flex>
)

export default CorrespondingAuthorMistake
