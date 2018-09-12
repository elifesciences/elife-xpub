import React from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'
import Icon from './Icon'

const CrossIcon = props => (
  <Icon
    iconName="X"
    overrideName="@pubsweet-pending.CalloutBox.CloseIcon"
    {...props}
  />
)

const IconButton = styled.button.attrs({
  type: 'button',
})`
  background-color: transparent;
  border: none;
  line-height: 0;
  padding: 0;
`

const CloseButton = ({ onClick, ...props }) => (
  <IconButton onClick={onClick} {...props}>
    <CrossIcon />
  </IconButton>
)

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  top: ${th('space.2')};
  right: ${th('space.2')};
  fill: ${th('colorTextSecondary')};
  height: ${th('space.3')};
  width: ${th('space.3')};
`

const Frame = styled(props => <Box {...props} />).attrs({
  mb: 2,
})`
  border: ${th('borderWidth')} ${th('borderStyle')} ${th('borderColor')};
  border-radius: ${th('borderRadius')};
  border-color: ${th('colorBorder')};
  position: relative;
`

const CalloutBox = ({ onClose, children, ...props }) => (
  <Frame {...props}>
    {onClose && <StyledCloseButton onClick={onClose} />}
    <Box p={3}>{children}</Box>
  </Frame>
)
export default CalloutBox
