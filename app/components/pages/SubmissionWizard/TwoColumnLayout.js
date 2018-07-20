import React from 'react'
import { Flex, Box } from 'grid-styled'

const TwoColumnLayout = ({ items, ...props }) => (
  <Flex flexWrap="wrap" mx={-2} {...props}>
    {items.map((item, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <Box key={index} px={2} width={[1, 1, 1 / 2]}>
        {item}
      </Box>
    ))}
  </Flex>
)

export default TwoColumnLayout
