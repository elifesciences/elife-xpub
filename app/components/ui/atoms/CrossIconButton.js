import React from 'react'
import styled from 'styled-components'

import Icon from './Icon'

const CrossIcon = props => <Icon iconName="X" overrideName="cross" {...props} />

const ButtonAsIconWrapper = styled.button.attrs({
  type: 'button',
})`
  background-color: transparent;
  border: none;
  line-height: 0;
  padding: 0;
`

const CrossIconButton = props => (
  <ButtonAsIconWrapper {...props}>
    <CrossIcon />
  </ButtonAsIconWrapper>
)

export default CrossIconButton
