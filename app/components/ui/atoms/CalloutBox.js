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

const CloseButton = styled(Icon)`
  position: absolute;
  top: 0px;
  right: 0px;
  padding: ${th('space.2')};
  svg {
    stroke: ${th('colorFurniture')};
    fill: ${th('colorFurniture')};
  }
`

const CalloutBox = ({ onClose, children, ...props }) => (
  <Frame {...props}>
    {onClose && (
      <CloseButton onClick={onClose} size={5}>
        Cross
      </CloseButton>
    )}
    <Box p={3}>{children}</Box>
  </Frame>
)
export default CalloutBox
