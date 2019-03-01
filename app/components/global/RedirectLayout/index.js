import React from 'react'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'
import AppBarContainer from 'ui/atoms/AppBarContainer'
import Centerer from '../layout/Centerer'

const LogoWrapper = styled.span`
  ${th('customMixins.logoHolder')};
`
const RedirectLayout = ({ children }) => (
  <Box pb={5}>
    <AppBarContainer>
      <LogoWrapper>
        <img alt="eLife" src="/assets/elife-logo.png" />
      </LogoWrapper>
    </AppBarContainer>
    <Centerer>{children}</Centerer>
  </Box>
)

export default RedirectLayout
