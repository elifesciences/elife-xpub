import React from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'

const Frame = styled(Box)`
  border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorPrimary')};
  background-color: ${th('colorPrimary')}20;
`

const CalloutTextBox = ({ children, ...props }) => (
  <Frame mb={2} p={3} {...props}>
    {children}{' '}
  </Frame>
)
export default CalloutTextBox
