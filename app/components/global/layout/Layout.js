import React from 'react'
import Centerer from './Centerer'
import AppBar from '../AppBar'

const Layout = ({ children }) => (
  <React.Fragment>
    <AppBar
      defaultMenuItems={[
        { label: 'Author guide', link: '/author-guide' },
        { label: 'Reviewer guide', link: '/reviewer-guide' },
        { label: 'Contact us', link: '/contact-us' },
      ]}
      userMenuItems={[{ label: 'Dashboard', link: '/' }]}
    />
    <Centerer>{children}</Centerer>
  </React.Fragment>
)

export default Layout
