import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const Paragraph = styled.p`
  font-family: ${th('fontReading')};
  font-size: ${th('fontSizeBase')};
  line-height: ${th(`lineHeightBase`)};

  margin-top: 0;
  margin-bottom: ${th('space.3')};

  &:last-child {
    margin-bottom: 0;
  }
`

export default Paragraph
