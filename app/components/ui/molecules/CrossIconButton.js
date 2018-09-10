import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import Icon from '../atoms/Icon'

const CrossIcon = ({ overrideName, ...props }) => (
  <Icon iconName="X" overrideName={overrideName} {...props} />
)

const IconButton = styled.button.attrs({
  type: 'button',
})`
  background-color: ${th('colorBackground')};
  border: none;
  line-height: 0;
  padding: 0;
`

const CrossIconButton = ({ onClick, iconOverrideName, ...props }) => (
  <IconButton onClick={onClick} {...props}>
    <CrossIcon overrideName={iconOverrideName} />
  </IconButton>
)

export default CrossIconButton
