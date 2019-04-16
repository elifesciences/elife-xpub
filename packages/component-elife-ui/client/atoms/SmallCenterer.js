import { Box } from '@rebass/grid'
import styled from 'styled-components'
import media from '@elifesciences/component-elife-ui/client/global/layout/media'

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

export default SmallCenterer
