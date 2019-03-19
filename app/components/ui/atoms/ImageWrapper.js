import styled from 'styled-components'
import { Box } from '@rebass/grid'
import media from 'global/layout/media'

const ImageWrapper = styled(Box)`
  width: 300px;
  height: 384px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  display: none;
  ${media.tabletPortraitUp`
  display: block`};
`

export default ImageWrapper
