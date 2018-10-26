import React from 'react'
import styled from 'styled-components'
import { Box, Flex } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'
import media from './media'

const TopNavContainer = styled.div`
  margin-bottom: ${th('space.3')} ${media.tabletPortraitUp`display: none;`};
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
      <SideNavContainer
        ml={[0, 0, '8.33%']} // 1 column's worth of spacing (in a 12 column grid)
        pr={3}
        pt={18} // To match the top padding on the H1 in the 'main' component
        width={[0, 3 / 12, 3 / 12, 2 / 12]}
      >
        {side}
      </SideNavContainer>
      <MainContainer width={[1, 1, 7 / 12, 7 / 12, 8 / 12]}>
        {main}
      </MainContainer>
    </Flex>
  </div>
)

export default SectionalLayout
