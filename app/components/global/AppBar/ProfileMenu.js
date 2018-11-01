import React from 'react'
import config from 'config'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { Link } from 'react-router-dom'
import { th } from '@pubsweet/ui-toolkit'
import NativeLink from '../../ui/atoms/NativeLink'
import Icon from '../../ui/atoms/Icon'
import PopOverPanel from '../../ui/atoms/PopOverPanel'

const loginUrl = config.login.url

const PositionRelative = styled.div`
  position: relative;
  display: inline-block;
`

const ProfileMenuButton = styled.button`
  background: none;
  border: none;
  padding: 0;
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

const PopOverPositioner = styled.div`
  position: absolute;
  top: ${th('space.4')};
  right: 0;
  max-width: 200px;
  z-index: 1400;
`

const Menu = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

const MenuItem = styled.li`
  display: block;
  white-space: nowrap;
`

const MenuHeading = styled.div`
  font-weight: bold;
  border-bottom: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  padding: ${th('space.2')};
  padding-right: ${th('space.3')};
  overflow: hidden;
  text-overflow: ellipsis;
`

const MenuItemLink = styled(Link)`
  display: block;
  padding: ${th('space.2')};
  padding-right: ${th('space.3')};
  color: ${th('colorText')};
  text-decoration: none;

  &:hover {
    background-color: ${th('colorPrimary')};
    color: ${th('colorTextReverse')};
  }
`

class ProfileMenu extends React.Component {
  state = { menuOpen: false }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ menuOpen: false })
    }
  }

  render() {
    const { user } = this.props
    if (!user) {
      return (
        <Box mx={3}>
          <NativeLink href={loginUrl}>Login</NativeLink>
        </Box>
      )
    }

    return (
      <PositionRelative
        innerRef={node => {
          this.wrapperRef = node
        }}
      >
        <ProfileMenuButton
          aria-expanded={this.state.menuOpen}
          aria-haspopup
          data-test-id="profile-menu"
          onClick={() => this.setState({ menuOpen: !this.state.menuOpen })}
        >
          <ProfileIcon />
          <IconArrow />
        </ProfileMenuButton>
        {this.state.menuOpen && (
          <PopOverPositioner>
            <PopOverPanel>
              <Menu>
                <MenuItem>
                  <MenuHeading>{user.identities[0].name}</MenuHeading>
                </MenuItem>
                <MenuItem>
                  <MenuItemLink data-test-id="logout" to="/logout">
                    Logout
                  </MenuItemLink>
                </MenuItem>
              </Menu>
            </PopOverPanel>
          </PopOverPositioner>
        )}
      </PositionRelative>
    )
  }
}

export default ProfileMenu
