import { css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

/**
 * TODO
 * this should be removed once it's implemented in pubsweet
 * right now they don't have colorWarning
 */
const borderColor = ({ theme, validationStatus = 'default' }) =>
  ({
    error: theme.colorError,
    success: theme.colorSuccess,
    warning: theme.colorWarning,
    default: theme.colorBorder,
  }[validationStatus])

/**
 * TODO
 *
 * font-size & line-height might change to fontSizeBase in the future
 *
 * move root margin-bottom at page level
 */
export default {
  Input: css`
    border-color: ${borderColor};
    color: ${th('colorText')};
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
    margin-bottom: ${th('space.3')};
  `,
}
