import styled from 'styled-components'
import { Flex } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'
import media from '@elifesciences/component-elife-ui/client/global/layout/media'

const TopBarContainer = styled(Flex)`
  align-items: center;
  height: ${th('space.6')};
  border-bottom: 1px solid ${th('colorBorder')};
  margin-bottom: 0;
  justify-content: space-between;

  ${media.tabletPortraitUp`
    margin-bottom: ${th('space.6')};
    justify-content: left;
  `};
`

export default TopBarContainer
