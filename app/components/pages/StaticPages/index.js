import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Flex } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'

import ErrorBoundary from '../../global/ErrorBoundary'
import media from '../../global/layout/media'
import NavLink from '../../ui/atoms/NavLink'
import NavigationDropdown from '../../ui/atoms/NavigationDropdown'

const TopNavContainer = styled(Box).attrs({ mx: -3 })`
  border-bottom: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  margin-bottom: ${th('space.3')};
  ${media.tabletPortraitUp`display: none;`};
`
const SideNavContainer = styled(Box)`
  display: none;
  ${media.tabletPortraitUp`display: block;`};
`
const MainContainer = styled(Box)``

const SideNavLink = styled(NavLink)`
  display: block;
  padding: ${th('space.1')} 0 ${th('space.1')} 0;
  &:first-child {
    padding-top: 0;
  }
`

const StaticPage = ({ history, navList }) => (
  <div>
    <ErrorBoundary>
      <TopNavContainer>
        <NavigationDropdown
          onSelection={item => history.push(item.value)}
          options={navList.map(navItem => ({
            label: navItem.label,
            value: navItem.link,
          }))}
          selectedValue={history.location.pathname}
        />
      </TopNavContainer>

      <Flex>
        <SideNavContainer
          ml={[0, 0, '8.33%']} // 1 column's worth of spacing (in a 12 column grid)
          pr={3}
          pt={18} // To match the top padding on the H1 in the 'main' component
          width={[0, 3 / 12, 3 / 12, 2 / 12]}
        >
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
        </SideNavContainer>

        <MainContainer width={[1, 1, 7 / 12, 7 / 12, 8 / 12]}>
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
        </MainContainer>
      </Flex>
    </ErrorBoundary>
  </div>
)

StaticPage.propTypes = {
  navList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      component: PropTypes.func.isRequired,
    }),
  ).isRequired,
}

export default StaticPage
