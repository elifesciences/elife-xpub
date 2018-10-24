import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import NavLink from '../../ui/atoms/NavLink'

const DropdownNavLink = styled(NavLink)`
  display: block;
  padding: ${th('space.1')};
`

const DropdownNavLayout = ({ children, navList }) => (
  <React.Fragment>
    {navList &&
      navList.map(navItem => (
        <DropdownNavLink
          data-test-id="side-nav-link"
          key={navItem.link}
          to={navItem.link}
        >
          {navItem.label}
        </DropdownNavLink>
      ))}
    {children}
  </React.Fragment>
)

DropdownNavLayout.propTypes = {
  navList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }),
  ),
}

DropdownNavLayout.defaultProps = {
  navList: [],
}

export default DropdownNavLayout
