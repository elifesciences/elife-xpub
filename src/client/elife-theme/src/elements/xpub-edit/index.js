import { css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

export const MenuBar = {
  Wrapper: css`
    border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
    border-radius: ${th('borderRadius')} ${th('borderRadius')} 0 0;
    background-color: ${th('colorBackgroundHue')};
    margin-bottom: 0;
    border-bottom: none;
    line-height: ${th('space.2')};
    padding: ${th('space.1')};
  `,
}

export const MenuButton = {
  Button: css`
    background-color: transparent;
    margin: ${th('space.1')}
    width: ${th('space.3')};
    /* subtract border width */
    height: calc(${th('space.3')} - 2px);
  `,
}

export const Editor = css`
  border-radius: 0 0 ${th('borderRadius')} ${th('borderRadius')};
  min-height: 12em;
`
