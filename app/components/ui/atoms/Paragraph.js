import styled, { css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const secondary = css`
  color: ${th('colorTextSecondary')};
`

const Paragraph = styled.p`
  font-family: ${th('fontReading')};
  font-size: ${th('fontSizeBase')};
  line-height: ${th(`lineHeightBase`)};

  margin-top: 0;
  margin-bottom: ${th('space.3')};

  &:last-child {
    margin-bottom: 0;
  }
  ${props => props.secondary && secondary};
`

export default Paragraph
