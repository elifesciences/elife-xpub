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
const attention = css`
  background-color: ${th('colorError')};
  border-color: ${th('colorError')};
  color: ${th('colorTextReverse')};

  &:focus,
  &:hover {
    background-color: ${darken('colorError', 0.3)};
    border-color: ${darken('colorError', 0.3)};
  }

  &:active {
    background-color: ${darken('colorError', 0.5)};
    border-color: ${darken('colorError', 0.5)};
  }

  &[disabled] {
    &:focus,
    &:hover,
    &:active {
      background-color: ${th('colorError')};
      border-color: ${th('colorError')};
    }
  }
`

export default css`
  font-size: ${th('fontSizeBaseSmall')}
  line-height: ${th('lineHeightBaseSmall')};
  padding: 12px 18px 9px 18px;
  text-transform: uppercase;
  font-family: ${th('fontHeading')};
  font-weight: 400;
  min-width: 120px;
  height: 48px;

  ${props => props.small && small};
  ${props => props.extraSmall && extraSmall};
  ${props => props.primary && primary};
  ${props => props.attention && attention};
`
