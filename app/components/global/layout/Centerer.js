import styled from 'styled-components'
import { Box } from '@rebass/grid'

const Centerer = styled(Box).attrs({
  mx: 'auto',
  px: 3,
  width: [1, 1, 1, 1, 1272],
})`
  min-width: 0;
`

export default Centerer
