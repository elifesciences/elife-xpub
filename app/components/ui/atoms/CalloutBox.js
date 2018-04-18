import React from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { th } from '@pubsweet/ui'

const CalloutBox = styled(({ enabled, ...rest }) => <Box {...rest} />).attrs({
  mx: -3,
  px: 3,
  mb: 3,
})`
  border: ${th('borderWidth')} ${th('borderStyle')} ${th('borderColor')};
  border-radius: ${th('borderRadius')};
  border-color: ${props => (props.enabled ? th('colorBorder') : 'transparent')};
`

export default CalloutBox
