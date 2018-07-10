import React from 'react'
import { Box } from 'grid-styled'
import AppBar from './AppBar'

const Layout = ({ children }) => (
  <React.Fragment>
    <AppBar />
    <Box mx="auto" px={3} width={[1, 1, 1, 1, 1272]}>
      {children}
    </Box>
  </React.Fragment>
)

export default Layout
