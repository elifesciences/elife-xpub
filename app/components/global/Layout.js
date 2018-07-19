import React from 'react'
import Centerer from './Centerer'
import AppBar from './AppBar'

const Layout = ({ children }) => (
  <React.Fragment>
    <AppBar />
    <Centerer>{children}</Centerer>
  </React.Fragment>
)

export default Layout
