import { Button } from '@pubsweet/ui'
import { darken, th } from '@pubsweet/ui-toolkit'
import styled from 'styled-components'

const colorOrcid = '#A6CE39'

const OrcidButton = styled(Button).attrs({ primary: true })`
  border-color: ${colorOrcid};
  background-color: ${colorOrcid};
  color: ${th('colorText')};

  &:focus,
  &:hover {
    border-color: ${darken(colorOrcid, 0.3)};
    background-color: ${darken(colorOrcid, 0.3)};
  }

  &:active {
    border-color: ${darken(colorOrcid, 0.5)};
    background-color: ${darken(colorOrcid, 0.5)};
  }

  &[disabled] {
    &:focus,
    &:hover,
    &:active {
      border-color: ${colorOrcid};
      background-color: ${colorOrcid};
    }
  }
`

export default OrcidButton
