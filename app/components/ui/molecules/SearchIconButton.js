import React from 'react'
import styled from 'styled-components'
import { Button } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'

import Icon from '../atoms/Icon'

const SearchIcon = props => (
  <Icon
    iconName="Search"
    overrideName="@pubsweet-pending.PeoplePicker.Search"
    {...props}
  />
)

const StyledSearchIcon = styled(SearchIcon)`
  fill: ${th('colorTextReverse')};
`

const IconButton = styled(Button)`
  line-height: 0;
  min-width: 0;
  padding: ${th('space.1')};
  margin: 0;
`

const SearchIconButton = ({ onClick, ...props }) => (
  <IconButton onClick={onClick} primary {...props}>
    <StyledSearchIcon />
  </IconButton>
)

export default SearchIconButton
