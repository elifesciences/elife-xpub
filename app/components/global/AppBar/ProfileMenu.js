import React from 'react'
import config from 'config'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { Link } from 'react-router-dom'
import { th } from '@pubsweet/ui-toolkit'
import ExternalLink from '../../ui/atoms/ExternalLink'
import Icon from '../../ui/atoms/Icon'

const loginUrl = config.login.url

const ProfileMenuButton = styled(Link)`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const ProfileIcon = props => (
  <Icon
    iconName="User"
    overrideName="@pubsweet-pending.AppBar.Profile"
    {...props}
  />
)

const IconArrow = styled.div`
  border: 4px solid transparent;
  border-top-color: ${th('colorText')};
  margin-bottom: -4px;
  margin-left: 4px;
`

const ProfileMenu = ({ user }) =>
  user ? (
    // whole button a logout link until drop down menu is implemented
    <ProfileMenuButton to="/logout">
      <ProfileIcon />
      <IconArrow />
    </ProfileMenuButton>
  ) : (
    <Box mx={3}>
      <ExternalLink href={loginUrl}>Login</ExternalLink>
    </Box>
  )

export default ProfileMenu
