import { css } from 'styled-components'
import { th, darken } from '@pubsweet/ui-toolkit'

const extraSmall = css`
  font-size: 11px;
  line-height: calc(${th('gridUnit')} * 2);
  padding: ${th('gridUnit')};
`

const small = css`
  padding: ${th('gridUnit')};
`

const primary = css`
  border-color: ${th('colorPrimary')};

  &:focus,
  &:hover {
    border-color: ${darken('colorPrimary', 0.3)};
  }

  &:active {
    border-color: ${darken('colorPrimary', 0.5)};
  }

  &[disabled] {
    &:focus,
    &:hover,
    &:active {
      border-color: ${th('colorPrimary')};
    }
  }
`

// TODO this should be updated when pubsweet changes gridUnit to 8px
export default css`
  line-height: calc(${th('gridUnit')} * 4);
  min-width: calc(${th('gridUnit')} * 16);
  padding: calc(${th('gridUnit')} * 2);
  font-size: 14px;
  text-transform: uppercase;

  ${props => props.small && small};
  ${props => props.extraSmall && extraSmall};
  ${props => props.primary && primary};
`
