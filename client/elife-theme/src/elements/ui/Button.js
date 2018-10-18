import { css } from 'styled-components'
import { th, darken } from '@pubsweet/ui-toolkit'

const extraSmall = css`
  font-size: 11px;
  line-height: 12px;
  padding: ${th('space.1')};
`

const small = css`
  padding: ${th('space.1')};
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

export default css`
  font-size: ${th('fontSizeBaseSmall')}
  line-height: ${th('lineHeightBaseSmall')};
  padding: ${th('space.2')};
  min-width: calc(${th('gridUnit')} * 28);
  text-transform: uppercase;

  ${props => props.small && small};
  ${props => props.extraSmall && extraSmall};
  ${props => props.primary && primary};
`
