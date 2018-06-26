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
 * for some reason th didn't work for spacing
 * padding: ${th('space.2') + 'px'};
 * margin-bottom: ${th('space.1') + 'px'};
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
    padding: ${props => `${props.theme.space[2]}px`};
    height: ${props => `${props.theme.space[5]}px`};
  `,
  Label: css`
    margin-bottom: ${props => `${props.theme.space[1]}px`};
  `,
  Root: css`
    margin-bottom: ${props => `${props.theme.space[3]}px`};
  `,
}
