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

const CloseButton = styled(CrossIcon)`
  position: absolute;
  top: ${th('space.2')};
  right: ${th('space.2')};
  cursor: pointer;
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
    {onClose && <CloseButton onClick={onClose} />}
    <Box p={3}>{children}</Box>
  </Frame>
)
export default CalloutBox
