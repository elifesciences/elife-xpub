import styled from 'styled-components'
import { Box } from '@rebass/grid'
import media from '@elifesciences/component-elife-ui/client/global/layout/media'

const ImageWrapper = styled(Box)`
  width: 75%;
  height: 100%;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  display: none;
  ${media.tabletLandscapeUp`
  display: block`};
`

export default ImageWrapper
