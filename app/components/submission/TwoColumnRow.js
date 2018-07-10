import React from 'react'
import { Flex, Box } from 'grid-styled'

const TwoColumnRow = ({ left, right }) => (
  <Flex flexWrap="wrap" mx={-2}>
    <Box px={2} width={[1, 1, 1 / 2]}>
      {left}
    </Box>
    <Box px={2} width={[1, 1, 1 / 2]}>
      {right}
    </Box>
  </Flex>
)

export default TwoColumnRow
