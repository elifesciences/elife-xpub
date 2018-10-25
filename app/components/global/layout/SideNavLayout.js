import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'
import NavLink from '../../ui/atoms/NavLink'
import SectionalLayout from './SectionalLayout'

const SideNavLink = styled(NavLink)`
  display: block;
  padding: ${th('space.1')} 0 ${th('space.1')} 0;
  &:first-child {
    padding-top: 0;
  }
`

const SideNavLayout = ({ children, navList }) => (
  <SectionalLayout
    main={children}
    side={
      <Box is="nav">
        {navList &&
          navList.map(navItem => (
            <SideNavLink
              data-test-id="side-nav-link"
              key={navItem.link}
              to={navItem.link}
            >
              {navItem.label}
            </SideNavLink>
          ))}
      </Box>
    }
  />
)

SideNavLayout.propTypes = {
  navList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default SideNavLayout
