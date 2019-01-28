import React from 'react'
import config from 'config'
import styled, { css } from 'styled-components'
import { Box } from '@rebass/grid'
import { Link } from 'react-router-dom'
import { th } from '@pubsweet/ui-toolkit'
import NativeLink from '../../ui/atoms/NativeLink'
import Icon from '../../ui/atoms/Icon'
import PopOverPanel from '../../ui/atoms/PopOverPanel'
import media from '../../global/layout/media'

const loginUrl = config.login.url

const PositionRelative = styled.div`
  position: relative;
  display: inline-block;
  ${media.tabletPortraitUp`
    margin-left: auto;
  `};
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
  font-family: ${th('fontHeading')};
  font-weight: 400;
  border-bottom: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  padding: ${th('space.2')};
  padding-right: ${th('space.3')};
  overflow: hidden;
  text-overflow: ellipsis;
`

const menuItemLinkStyling = css`
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
const MenuItemLink = styled(Link)`
  ${menuItemLinkStyling};
`
const MenuItemExternalLink = styled.a`
  ${menuItemLinkStyling};
`

const LoginWrapper = styled(Box)`
  ${media.tabletPortraitUp`
    margin-left: auto;
  `};
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
        <LoginWrapper>
          <NativeLink href={loginUrl}>Login</NativeLink>
        </LoginWrapper>
      )
    }

    return (
      <PositionRelative
        ref={node => {
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
                  <MenuItem>
                    <MenuItemExternalLink
                      data-test-id="manage-orcid"
                      href="https://orcid.org/my-orcid"
                      target="_blank"
                    >
                      Manage ORCID
                    </MenuItemExternalLink>
                  </MenuItem>
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
