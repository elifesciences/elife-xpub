import { css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

export default {
  Arrow: css`
    color: ${th('colorTextSecondary')};
    transition: none;
    font-size: ${th('gridUnit')};
  `,
  Label: css`
    margin-bottom: ${th('space.1')};
  `,
  Opener: css`
    padding: 10px;
    min-height: ${th('space.5')};
    &:hover {
      border-color: ${th('colorBorder')};
    }
    ${props =>
      props.open &&
      `border-bottom-left-radius: 0; border-bottom-right-radius: 0;`};
  `,
  Option: css`
    height: ${th('space.5')};
    line-height: ${th('space.5')};
    padding: 0 10px;
    font-weight: inherit;

    &:hover {
      color: ${th('colorTextReverse')};
      background-color: ${th('colorPrimary')};
      border: none;
    }
  `,
  Options: css`
    top: -1px;
    border-radius: 0 0 ${th('borderRadius')} ${th('borderRadius')};
  `,
  Value: css`
    &:hover {
      color: ${th('colorText')};
    }
    border-right: none;
    padding: 0px;
  `,
  Placeholder: css`
    font-style: normal;
    padding: 0px;
    &:hover {
      color: ${th('colorTextPlaceholder')};
    }
  `,
}
