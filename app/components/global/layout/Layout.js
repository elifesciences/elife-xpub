import React from 'react'
import { Box } from 'grid-styled'
import Centerer from './Centerer'
import AppBar from '../AppBar'

const Layout = ({ children }) => (
  <Box pb={5}>
    <AppBar
      defaultMenuItems={[
        { label: 'Author guide', link: '/author-guide' },
        { label: 'Reviewer guide', link: '/reviewer-guide' },
        { label: 'Contact us', link: '/contact-us' },
      ]}
      userMenuItems={[{ label: 'Dashboard', link: '/' }]}
    />
    <Centerer>{children}</Centerer>
  </Box>
)

export default Layout
