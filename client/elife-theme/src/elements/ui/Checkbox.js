import { css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

// TODO: remove this once themes support icons
const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="#fff" stroke="#fff" />
</svg>`

export default css`
  font-size: ${th('fontSizeBaseSmall')};
  
  input {
    position: absolute;
    opacity: 0;
    z-index: -1;
  }

  span::before {
    content: ' ';
    display: inline-block;
    vertical-align: middle;

    box-sizing: border-box;
    width: ${th('space.3')};
    height: ${th('space.3')};
    margin-right: ${th('space.1')};

    background: transparent;
    border: 1px solid ${th('colorBorder')};
    border-radius: ${th('borderRadius')};
  }
  
  input:checked + span::before {
    border-color: ${th('colorPrimary')};
    background: url('data:image/svg+xml;utf8,${encodeURIComponent(
      checkIcon,
    )}') center/75% no-repeat, ${th('colorPrimary')};
  }
`
