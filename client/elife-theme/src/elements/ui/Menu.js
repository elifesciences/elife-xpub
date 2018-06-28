import { css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

export default {
  Arrow: css`
    color: ${th('colorTextSecondary')};
    transition: none;
    font-size: ${th('gridUnit')};
  `,
  ArrowContainer: css`
    border-left: none;
  `,
  Label: css`
    margin-bottom: ${th('space.1')};
  `,
  Opener: css`
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
    padding: 0 ${th('space.2')};
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
  `,
  Placeholder: css`
    font-style: normal;
    &:hover {
      color: ${th('colorTextPlaceholder')};
    }
  `,
}
