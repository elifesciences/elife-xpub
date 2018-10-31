import React from 'react'
import { Flex, Box } from 'grid-styled'

const StaffGrid = ({ children, ...props }) => (
  <Flex flexWrap="wrap" mb={-3} mx={-2} {...props}>
    {children.map((item, index) => (
      <Box key={item.key || index} mb={3} px={2} width={[1 / 1, 1 / 2, 1 / 3]}>
        {item}
      </Box>
    ))}
  </Flex>
)

export default StaffGrid
