import { css } from 'styled-components'

const extraSmall = css`
  font-size: 11px;
  line-height: calc(${props => props.theme.gridUnit} * 2);
  padding: ${props => props.theme.gridUnit};
`

const small = css`
  padding: ${props => props.theme.gridUnit};
`

const primary = css`
  border: 0 none;
`

const reverse = css`
  background: #262626;
  color: ${props => props.theme.colorTextReverse};
  border-color: ${props => props.theme.colorTextReverse};
`

export default css`
  line-height: calc(${props => props.theme.gridUnit} * 4);
  min-width: calc(${props => props.theme.gridUnit} * 16);
  padding: calc(${props => props.theme.gridUnit} * 2);
  font-size: 14px;

  ${props => props.small && small};
  ${props => props.extraSmall && extraSmall};
  ${props => props.primary && primary};
  ${props => props.reverse && reverse};
`
