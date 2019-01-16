import { darken, th } from '@pubsweet/ui-toolkit'
import styled from 'styled-components'
import { Button } from '@pubsweet/ui'

const colorOrcid = '#A6CE39'

const ButtonOrcid = styled(Button).attrs({ primary: true })`
  border-color: ${colorOrcid};
  background-color: ${colorOrcid};
  color: ${th('colorText')};
  width: 178px;

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

export default ButtonOrcid
