import React from 'react'
import { Box } from '@rebass/grid'
import Centerer from '@elifesciences/component-elife-ui/client/global/layout/Centerer'
import WrappedAppBar from './WrappedAppBar'

const Layout = ({ children }) => (
  <Box pb={5}>
    <WrappedAppBar
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
