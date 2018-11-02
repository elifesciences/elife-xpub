import { css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

export default css`
  /* clear browser-added margin and font-size */
  margin-top: 0px;
  color: ${th('colorText')};
  font-weight: 400;
`

export const H1 = css`
  padding-top: 18px;
  padding-bottom: 18px;
  line-height: ${th('lineHeight1')};
`

export const H2 = css`
  padding-top: 9px;
  padding-bottom: 9px;
  line-height: ${th('lineHeight2')};
`

export const H3 = css`
  padding-top: 12px;
  padding-bottom: 12px;
  line-height: ${th('lineHeight3')};
`

export const H4 = css`
  padding-top: 12px;
  padding-bottom: 12px;
  line-height: ${th('lineHeight4')};
`
