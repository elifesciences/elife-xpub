import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import RemoveButton from './CrossIconButton'

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
