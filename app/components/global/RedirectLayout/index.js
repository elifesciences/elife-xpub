import React from 'react'
import { Box } from '@rebass/grid'
import Centerer from '../layout/Centerer'

const RedirectLayout = ({ children }) => (
  <Box pb={5}>
    <Centerer>{children}</Centerer>
  </Box>
)

export default RedirectLayout
