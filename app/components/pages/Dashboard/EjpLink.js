import React from 'react'
import styled from 'styled-components'

import SmallParagraph from '../../ui/atoms/SmallParagraph'
import NativeLink from '../../ui/atoms/NativeLink'

const CenterdSmallParagraph = styled(SmallParagraph).attrs({ secondary: true })`
  text-align: center;
`

const EjpLink = () => (
  <CenterdSmallParagraph>
    Can&#39;t find a submission? You might find it in our full{' '}
    <NativeLink href="https://submit.elifesciences.org">
      peer review and submissions
    </NativeLink>{' '}
    system
  </CenterdSmallParagraph>
)

export default EjpLink
