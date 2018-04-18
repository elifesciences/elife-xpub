import styled from 'styled-components'
import { Box } from 'grid-styled'
import { th } from '@pubsweet/ui'

const CalloutBox = styled(Box).attrs({ mx: -3, px: 3, mb: 3 })`
  border: ${th('borderWidth')} ${th('borderStyle')} ${th('borderColor')};
  border-radius: ${th('borderRadius')};
`

export default CalloutBox
