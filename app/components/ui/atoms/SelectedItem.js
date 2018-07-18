import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import CrossIcon from './icons/Cross'

const Root = styled.div`
  border-radius: ${th('borderRadius')}
  background-color: ${th('colorPrimary')};
  line-height: ${th('fontLineHeightBase')};
  padding: ${th('space.1')};
  padding-left: ${th('space.2')};
  padding-right: ${th('space.2')};
  color: ${th('colorTextReverse')};
  display: inline-flex;
  align-items: center;
`

const StyledIcon = styled(CrossIcon)`
  width: ${th('space.4')};
  padding: ${th('space.2')};
  margin: -${th('space.2')};
  margin-left: ${th('space.0')};
  cursor: pointer;
`

const SelectedItem = ({ label, onCloseClick }) => (
  <Root>
    {label} <StyledIcon onClick={onCloseClick} />
  </Root>
)

export default SelectedItem
