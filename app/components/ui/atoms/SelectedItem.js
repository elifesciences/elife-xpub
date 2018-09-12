import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import Icon from '../atoms/Icon'
import ButttonAsIconWraper from './ButtonAsIconWrapper'

const CrossIcon = ({ overrideName, ...props }) => (
  <Icon iconName="X" overrideName="@pubsweet-pending.Tags.Remove" {...props} />
)

const StyledRemoveButton = styled(ButttonAsIconWraper)`
  fill: ${th('colorTextReverse')};
  margin-left: ${th('space.1')};
`

const Root = styled.div`
  border-radius: ${th('borderRadius')};
  background-color: ${th('colorPrimary')};
  line-height: ${th('lineHeightBase')};
  padding: ${th('space.1')} ${th('space.2')} ${th('space.1')} ${th('space.2')}
  color: ${th('colorTextReverse')};
  display: inline-flex;
  align-items: center;
`

const SelectedItem = ({ label, onCloseClick }) => (
  <Root>
    {label}{' '}
    <StyledRemoveButton onClick={onCloseClick}>
      <CrossIcon />
    </StyledRemoveButton>
  </Root>
)

export default SelectedItem
