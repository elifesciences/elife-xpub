import styled from 'styled-components'
import { Box } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'

const FooterMessage = styled(Box).attrs({
  p: 3,
  width: 1,
})`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.9);
  color: ${th('colorTextReverse')};
  font-size: ${th('fontSizeBaseSmall')};
  text-align: center;
  a {
    color: ${th('colorTextReverse')};
    text-decoration: underline;
  }
`

export default FooterMessage
