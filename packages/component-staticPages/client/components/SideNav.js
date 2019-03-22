import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { Box } from '@rebass/grid'

import NavLink from 'ui/atoms/NavLink'

const SideNavLink = styled(NavLink)`
  display: block;
  padding: ${th('space.2')} 0 ${th('space.2')} 0;
  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    padding-bottom: 0;
  }
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('lineHeightBaseSmall')};
`

const SideNav = ({ navList }) => (
  <Box is="nav">
    {navList &&
      navList.map(navItem => (
        <SideNavLink
          data-test-id={navItem.link}
          key={navItem.link}
          to={navItem.link}
        >
          {navItem.label}
        </SideNavLink>
      ))}
  </Box>
)

SideNav.propTypes = {
  navList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      component: PropTypes.func.isRequired,
    }),
  ).isRequired,
}

export default SideNav
