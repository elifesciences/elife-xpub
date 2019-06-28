import { css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

export const logoHolder = css`
  height: calc(9 * ${th('gridUnit')});
  padding: ${th('space.2')};
  margin: 0 ${th('space.2')};

  img {
    height: 100%;
  }
`
