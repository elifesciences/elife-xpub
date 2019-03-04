import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import Paragraph from 'ui/atoms/Paragraph'

const CenteredSmallParagraph = styled(Paragraph.Small).attrs({
  secondary: true,
})`
  font-size: 12px;
  font-weight: 400;
  font-family: 'Noto Sans';
  text-align: center;
  a {
    color: ${th('colorPrimary')};
    text-decoration: none;
  }
`

const FooterText = ({ children }) => (
  <CenteredSmallParagraph>{children}</CenteredSmallParagraph>
)

export default FooterText
