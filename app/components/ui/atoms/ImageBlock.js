import styled from 'styled-components'
import { Box } from '@rebass/grid'

const ImageBlock = styled(Box)`
  width:75%
  height: 100%;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
`

export default ImageBlock
