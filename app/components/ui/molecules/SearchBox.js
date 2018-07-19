import React from 'react'
import { TextField } from '@pubsweet/ui'
import styled from 'styled-components'

import Icon from '../atoms/Icon'

const Root = styled.div`
  position: relative;
`

const IconContainer = styled.div`
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  height: 100%;
`

const SearchBox = props => (
  <Root>
    <IconContainer>
      <Icon size={3}>Search</Icon>
    </IconContainer>
    <TextField placeholder="Search..." {...props} />
  </Root>
)

export default SearchBox
