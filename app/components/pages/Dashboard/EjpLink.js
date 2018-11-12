import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import SmallParagraph from '../../ui/atoms/SmallParagraph'
import NativeLink from '../../ui/atoms/NativeLink'

const CenterdSmallParagraph = styled(SmallParagraph)`
  color: ${th('colorTextSecondary')};
  text-align: center;
`

const EjpLink = props => (
  <CenterdSmallParagraph>
    Can&#39;t find a submission? You might find it in our full{' '}
    <NativeLink href="https://submit.elifesciences.org">
      peer review and submissions
    </NativeLink>{' '}
    system
  </CenterdSmallParagraph>
)

export default EjpLink
