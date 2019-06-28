import React from 'react'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'
import {
  TopBarContainer,
  SmallCenterer,
} from '@elifesciences/component-elife-ui/client/atoms'

const LogoWrapper = styled.span`
  ${th('customMixins.logoHolder')};
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
