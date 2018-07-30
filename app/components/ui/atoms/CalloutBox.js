import React from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'
import Icon from './Icon'

const Frame = styled(props => <Box {...props} />).attrs({
  mb: 2,
})`
  border: ${th('borderWidth')} ${th('borderStyle')} ${th('borderColor')};
  border-radius: ${th('borderRadius')};
  border-color: ${th('colorBorder')};
  position: relative;
`

const CloseButton = styled(Icon).attrs({
  size: 2,
  children: 'Cross',
})`
  position: absolute;
  top: ${th('space.2')};
  right: ${th('space.2')};
  padding: ${th('space.1')};
  cursor: pointer;
  svg {
    stroke: ${th('colorTextSecondary')};
    fill: ${th('colorTextSecondary')};
  }
`

const CalloutBox = ({ onClose, children, ...props }) => (
  <Frame {...props}>
    {onClose && <CloseButton onClick={onClose} />}
    <Box p={3}>{children}</Box>
  </Frame>
)
export default CalloutBox
