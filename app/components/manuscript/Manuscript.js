import React from 'react'
import { Heading } from '@pubsweet/ui'
import { Box } from 'grid-styled'
import styled from 'styled-components'

const TitleBox = styled(Box)`
  text-align: center;
`

const Manuscript = () => (
  <Box mx={5}>
    <TitleBox mb={5}>
      <Heading level={1}>
        Dynamic representation of 3D auditory space in the midbrain of the
        free-flying echolocating bat
      </Heading>
      <p>Authors details here</p>
    </TitleBox>

    <Heading level={2}>Abstract</Heading>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus
      justo, pharetra imperdiet vehicula a, semper eget sem. Proin euismod sem
      elit, congue commodo lorem sodales nec. Sed at consequat orci, in
      ullamcorper odio. Vivamus quis ipsum molestie, eleifend nunc quis,
      imperdiet ante. Cras congue urna eu tincidunt ultricies. Phasellus mollis
      magna eget felis ullamcorper, ac pellentesque magna euismod. Donec quis
      felis vel mi tempor pulvinar. Etiam nec dolor eros.
    </p>
  </Box>
)

export default Manuscript
