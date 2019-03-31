import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Flex } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'

import media from '@elifesciences/component-elife-ui/client/global/layout/media'
import { NavigationDropdown } from '@elifesciences/component-elife-ui/client/atoms'
import { ErrorBoundary } from '@elifesciences/component-elife-app/client'

import SideNav from './SideNav'
import ScrollToTop from './ScrollToTop'

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

const Layout = ({ history, navList }) => (
  <div>
    <ErrorBoundary>
      <TopNavContainer>
        <NavigationDropdown
          onSelection={item => history.push(item.value)}
          options={navList.map(navItem => ({
            label: navItem.label,
            value: navItem.link,
          }))}
          value={history.location.pathname}
        />
      </TopNavContainer>

      <Flex>
        <SideNavContainer
          ml={[0, 0, `8.33%`, `8.33%`, `8.33%`]}
          mr={3}
          pt={18} // To match the top padding on the H1 in the 'main' component
          width={[0, 0, 3 / 12, 2 / 12, 2 / 12]}
        >
          <SideNav navList={navList} />
        </SideNavContainer>

        <ScrollToTop>
          <MainContainer
            mr={[0, 0, `8.33%`, `16.67%`, `25%`]}
            width={[1, 1, 7 / 12, 7 / 12, 6 / 12]}
          >
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
        </ScrollToTop>
      </Flex>
    </ErrorBoundary>
  </div>
)

Layout.propTypes = {
  navList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      component: PropTypes.func.isRequired,
    }),
  ).isRequired,
}

export default Layout
