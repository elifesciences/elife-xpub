import styled, { css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const secondary = css`
  color: ${th('colorTextSecondary')};
`
const small = css`
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th(`lineHeightBaseSmall`)};
`
const reading = css`
  font-family: ${th('fontReading')};
`

const BaseParagraph = styled.p`
  font-family: ${th('fontWriting')};
  font-size: ${th('fontSizeBase')};
  line-height: ${th(`lineHeightBase`)};

  margin-top: 0;
  margin-bottom: ${th('space.3')};

  &:last-child {
    margin-bottom: 0;
  }
  ${props => props.secondary && secondary};
`
const Paragraph = {
  Small: styled(BaseParagraph)`
    ${small};
  `,
  Reading: styled(BaseParagraph)`
    ${reading};
  `,
  Writing: BaseParagraph,
}

export default Paragraph
