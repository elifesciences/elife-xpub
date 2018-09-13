import React from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'

import CloseButton from './CrossIconButton'

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
