import React from 'react'
import styled, { css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import Paragraph from 'ui/atoms/Paragraph'
import media from 'global/layout/media'

const CenteredSmallParagraph = styled(Paragraph.Small).attrs({
  secondary: true,
})`
  font-size: 12px;
  font-weight: 400;
  font-family: 'Noto Sans';
  text-align: center;

  ${props =>
    props.onlyCenterDesktop &&
    css`
      text-align: left;
      ${media.desktopUp`
      text-align: center;
    `};
    `} a {
    color: ${th('colorPrimary')};
    text-decoration: none;
  }
`

const FooterText = ({ children, ...rest }) => (
  <CenteredSmallParagraph {...rest}>{children}</CenteredSmallParagraph>
)

export default FooterText
