import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import Icon from '../atoms/Icon'

const CrossIcon = ({ overrideName, ...props }) => (
  <Icon
    iconName="Paperclip"
    overrideName="@pubsweet-pending.Tags.Remove"
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

const RemoveButton = ({ onClick, ...props }) => (
  <IconButton onClick={onClick} {...props}>
    <CrossIcon />
  </IconButton>
)

const StyledRemoveButton = styled(RemoveButton)`
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
    {label} <StyledRemoveButton onClick={onCloseClick} />
  </Root>
)

export default SelectedItem
