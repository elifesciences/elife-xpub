import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Flex, Box } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'
import {
  NavLink,
  TopBarContainer,
} from '@elifesciences/component-elife-ui/client/atoms'
import media from '@elifesciences/component-elife-ui/client/global/layout/media'
import BurgerMenu from '@elifesciences/component-elife-ui/client/molecules/BurgerMenu'
import ProfileMenu from './ProfileMenu'

export const AppBarLink = styled(NavLink)`
  display: inline-block;
  padding: ${th('space.3')} ${th('space.2')};
`

const LogoLink = styled.a`
  ${th('customMixins.logoHolder')};
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
  <TopBarContainer px={3}>
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
  </TopBarContainer>
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
