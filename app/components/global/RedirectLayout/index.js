import React from 'react'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'
import AppBarContainer from 'ui/atoms/AppBarContainer'

const LogoWrapper = styled.span`
  ${th('customMixins.logoHolder')};
`

const SmallCenterer = styled(Box).attrs({
  mx: 'auto',
  px: 3,
  width: [1, 1, 1, 1000],
})`
  min-width: 0;
`

const RedirectLayout = ({ children }) => (
  <Box pb={5}>
    <AppBarContainer px={3}>
      <LogoWrapper>
        <img alt="eLife" src="/assets/elife-logo.png" />
      </LogoWrapper>
    </AppBarContainer>
    <SmallCenterer>{children}</SmallCenterer>
  </Box>
)

export default RedirectLayout
