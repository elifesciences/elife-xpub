import React from 'react'
import styled from 'styled-components'
import { Box, Flex } from 'grid-styled'
import media from './media'

const TopNavContainer = styled.div`
  ${media.tabletPortraitUp`display: none;`};
`
const SideNavContainer = styled(Box)`
  display: none;
  ${media.tabletPortraitUp`display: block;`};
`
const MainContainer = styled(Box)``

const SectionalLayout = ({ top, side, main }) => (
  <div>
    <TopNavContainer>{top}</TopNavContainer>
    <Flex>
      <SideNavContainer ml={[0, 0, '8.33%']} width={[0, 0, 3 / 12, 2 / 12]}>
        {side}
      </SideNavContainer>
      <MainContainer width={[1, 1, 7 / 12, 7 / 12, 6 / 12]}>
        {main}
      </MainContainer>
    </Flex>
  </div>
)

export default SectionalLayout
