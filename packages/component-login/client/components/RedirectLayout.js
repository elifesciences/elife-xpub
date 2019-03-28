import React from 'react'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'
import media from '@elifesciences/component-elife-ui/client/global/layout/media'
import TopBarContainer from '@elifesciences/component-elife-ui/client/ui/atoms/TopBarContainer'

const LogoWrapper = styled.span`
  ${th('customMixins.logoHolder')};
`

const SmallCenterer = styled(Box).attrs({
  mx: 'auto',
  mt: 5,
  px: 5,
  width: [1, 1, 1, 1000],
})`
  min-width: 0;
  ${media.tabletPortraitUp`
  margin-top: 0;
`};
`

const RedirectLayout = ({ children }) => (
  <Box pb={5}>
    <TopBarContainer px={3}>
      <LogoWrapper>
        <img alt="eLife" src="/assets/elife-logo.png" />
      </LogoWrapper>
    </TopBarContainer>
    <SmallCenterer>{children}</SmallCenterer>
  </Box>
)

export default RedirectLayout
