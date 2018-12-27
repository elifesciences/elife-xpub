import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Flex, Box } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'
import ProfileMenu from './ProfileMenu'
import NavLink from '../../ui/atoms/NavLink'
import media from '../../global/layout/media'
import BurgerMenu from '../../ui/molecules/BurgerMenu'

const AppBarContainer = styled(Flex)`
  align-items: center;
  height: ${th('space.6')};
  border-bottom: 1px solid ${th('colorBorder')};
  margin-bottom: 0;
  justify-content: space-between;

  ${media.tabletPortraitUp`
    margin-bottom: ${th('space.6')};
    justify-content: left;
  `};
`

export const AppBarLink = styled(NavLink)`
  display: inline-block;
  padding: ${th('space.3')} ${th('space.2')};
`

const LogoLink = styled.a`
  height: calc(9 * ${th('gridUnit')});
  padding: ${th('space.2')};
  margin: 0 ${th('space.2')};

  img {
    height: 100%;
  }
`

const Separator = styled.div`
  height: ${th('space.3')};
  border-left: 1px solid ${th('colorBorder')};
  margin-right: ${th('space.2')};
`
const DesktopView = styled(Flex)`
  align-items: center;
  display: none;
  ${media.tabletPortraitUp`
    display: flex;
  `};
`

const AppBar = ({ user, menuItems }) => (
  <AppBarContainer px={3}>
    <BurgerMenu menuItems={menuItems} />
    <LogoLink href="https://elifesciences.org">
      <img alt="eLife" src="/assets/elife-logo.png" />
    </LogoLink>
    <DesktopView data-test-id="app-bar-menu">
      <Separator />
      <Box flex="1 1 auto">
        {menuItems &&
          menuItems.map(item => (
            <AppBarLink key={item.link} to={item.link}>
              {item.label}
            </AppBarLink>
          ))}
      </Box>
    </DesktopView>
    <ProfileMenu user={user} />
  </AppBarContainer>
)

AppBar.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default AppBar
