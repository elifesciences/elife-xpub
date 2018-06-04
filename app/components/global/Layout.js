import React from 'react'
import { Box } from 'grid-styled'
import AppBar from './AppBar'

const Layout = ({ children }) => (
  <React.Fragment>
    <AppBar />
    <Box mx={[1, 3]}>{children}</Box>
  </React.Fragment>
)

export default Layout
