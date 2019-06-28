import { css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

/**
 * TODO
 *
 * font-size & line-height might change to fontSizeBase in the future
 *
 * move root margin-bottom at page level
 */
export default {
  Input: css`
    border: ${th('borderWidth')} ${th('borderStyle')}
      ${({ validationStatus }) =>
        validationStatus === 'error' ? th('colorError') : th('colorBorder')};
    font-family: ${th('fontInterface')};
    font-size: 16px;
    line-height: 24px;
    padding: ${th('space.2')};
    height: ${th('space.5')};
  `,
  Label: css`
    margin-bottom: ${th('space.1')};
  `,
  Root: css`
    margin-bottom: 0px;
  `,
}
