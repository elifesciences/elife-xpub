import { Box } from '@rebass/grid'
import styled, { css } from 'styled-components'

const ImageBlock = styled(Box)`
  width:75%
  height: 100%;
  ${props =>
    css`
      background-image: url(${props.image});
    `}
  background-size: cover;
  background-position: center;
`

export default ImageBlock
