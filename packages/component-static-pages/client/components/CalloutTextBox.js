import React from 'react'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'

const Frame = styled(Box)`
  border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorPrimary')};
  // 8-character hex code - applying opacity value on top of 6-character hex code from theme
  background-color: ${th('colorPrimary')}20;
`

const CalloutTextBox = ({ children, ...props }) => (
  <Frame mb={2} p={3} {...props}>
    {children}{' '}
  </Frame>
)
export default CalloutTextBox
