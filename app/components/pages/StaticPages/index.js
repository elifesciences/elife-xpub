import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'

import NavLink from '../../ui/atoms/NavLink'
import SectionalLayout from '../../global/layout/SectionalLayout'

const SideNavLink = styled(NavLink)`
  display: block;
  padding: ${th('space.1')} 0 ${th('space.1')} 0;
  &:first-child {
    padding-top: 0;
  }
`

const StaticPage = ({ navList }) => (
  <SectionalLayout
    main={
      <Switch>
        {navList &&
          navList.map(navItem => (
            <Route
              component={navItem.component}
              exact
              key={navItem.link}
              path={navItem.link}
            />
          ))}
        <Redirect to={navList[0].link} />
      </Switch>
    }
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

StaticPage.propTypes = {
  navList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default StaticPage
