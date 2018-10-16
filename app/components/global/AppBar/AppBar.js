import React from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { NavLink } from 'react-router-dom'
import { th } from '@pubsweet/ui-toolkit'
import ProfileMenu from './ProfileMenu'

const AppBarContainer = styled.div`
  display: flex;
  align-items: center;
  height: ${th('space.6')};
  border-bottom: 1px solid ${th('colorBorder')};
  margin-bottom: ${th('space.3')};
  padding-right: ${th('space.3')};
`

const AppBarLink = styled(NavLink)`
  display: inline-block;
  padding: ${th('space.3')} ${th('space.2')};
  line-height: ${th('fontLineHeightBase')};
  color: ${th('colorTextSecondary')};
  text-decoration: none;

  &.active,
  &:hover {
    color: ${th('colorText')};
  }
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

const AppBar = ({ user }) => (
  <AppBarContainer>
    <LogoLink href="https://elifesciences.org">
      <img alt="eLife" src="/assets/elife-logo.png" />
    </LogoLink>
    <Separator />
    <Box flex="1 1 auto">
      {user && (
        <AppBarLink exact to="/">
          Dashboard
        </AppBarLink>
      )}
      <AppBarLink exact to="/author-guide">
        Author Guide
      </AppBarLink>
      <AppBarLink exact to="/reviewer-guide">
        Reviewer Guide
      </AppBarLink>
      <AppBarLink exact to="/contact-us">
        Contact Us
      </AppBarLink>
    </Box>
    <ProfileMenu user={user} />
  </AppBarContainer>
)

export default AppBar
