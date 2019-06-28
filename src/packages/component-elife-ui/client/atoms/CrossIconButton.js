import React from 'react'
import Icon from './Icon'
import ButtonAsIconWrapper from './ButtonAsIconWrapper'

const CrossIcon = props => <Icon iconName="X" overrideName="cross" {...props} />

const CrossIconButton = props => (
  <ButtonAsIconWrapper {...props}>
    <CrossIcon />
  </ButtonAsIconWrapper>
)

export default CrossIconButton
