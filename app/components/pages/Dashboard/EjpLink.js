import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { th } from '@pubsweet/ui-toolkit'
import Paragraph from '../../ui/atoms/Paragraph'
import NativeLink from '../../ui/atoms/NativeLink'

const CenteredSmallParagraph = styled(Paragraph.Small).attrs({
  secondary: true,
})`
  font-size: 12px;
  font-weight: 400;
  font-family: 'Noto Sans';
  text-align: center;
`

const ResearchAdvanceLink = styled(Link)`
  color: ${th('colorPrimary')};
  text-decoration: none;
`

const EjpLink = () => (
  <CenteredSmallParagraph>
    To find existing submissions or to submit a{' '}
    <ResearchAdvanceLink to="/author-guide/types">
      Research Advance
    </ResearchAdvanceLink>{' '}
    please visit our{' '}
    <NativeLink href="https://submit.elifesciences.org">
      full peer review and submissions system
    </NativeLink>{' '}
  </CenteredSmallParagraph>
)

export default EjpLink
