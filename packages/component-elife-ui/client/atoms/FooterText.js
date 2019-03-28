import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { Paragraph } from '@elifesciences/component-elife-ui/client/atoms'

const CenteredSmallParagraph = styled(Paragraph.Small).attrs({
  secondary: true,
})`
  font-size: 12px;
  font-weight: 400;
  font-family: 'Noto Sans';
  text-align: center;
  ${props => props.customStyle} a {
    color: ${th('colorPrimary')};
    text-decoration: none;
  }
`

const FooterText = ({ children, ...rest }) => (
  <CenteredSmallParagraph {...rest}>{children}</CenteredSmallParagraph>
)

export default FooterText
