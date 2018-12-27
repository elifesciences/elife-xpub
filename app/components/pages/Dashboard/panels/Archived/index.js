import React from 'react'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'

const EmptyListMessage = styled(Box)`
  text-align: center;
  color: ${th('colorTextSecondary')};
`

const Archived = () => (
  <EmptyListMessage mt={7}>Archived placeholder view.</EmptyListMessage>
)

export default Archived
