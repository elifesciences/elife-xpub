import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'
import ProfileMenu from './ProfileMenu'
import NavLink from '../../ui/atoms/NavLink'
import media from '../../global/layout/media'
import BurgerMenu from '../../ui/molecules/BurgerMenu'

const AppBarContainer = styled.div`
  display: flex;
  align-items: center;
  height: ${th('space.6')};
  border-bottom: 1px solid ${th('colorBorder')};
  margin-bottom: ${th('space.3')};
  padding-right: ${th('space.3')};
  justify-content: space-between;
`

const AppBarLink = styled(NavLink)`
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
  width:80%
  align-items: center;
  display: none;
  ${media.mobileUp`
    display: flex;
  `};
`

const AppBar = ({ user, menuItems }) => (
  <AppBarContainer>
    <BurgerMenu menuItems={menuItems} />
    <LogoLink href="https://elifesciences.org">
      <img alt="eLife" src="/assets/elife-logo.png" />
    </LogoLink>
    <DesktopView>
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

export default AppBar
