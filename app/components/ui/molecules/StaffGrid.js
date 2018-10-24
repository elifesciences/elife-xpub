import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'

const Card = styled(Box)`
  padding-top: ${th('space.3')};
`

const StaffGrid = ({ children, ...props }) => (
  <Flex flexWrap="wrap" mx={-2} {...props}>
    {children.map((item, index) => (
      <Card key={item.key || index} px={2} width={[1 / 2, 1 / 2, 1 / 3]}>
        {item}
      </Card>
    ))}
  </Flex>
)

export default StaffGrid
