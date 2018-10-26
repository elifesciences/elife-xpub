import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'
import Icon from '../atoms/Icon'
import ButtonAsIconWrapper from '../atoms/ButtonAsIconWrapper'
import CrossIconButton from '../atoms/CrossIconButton'
import NavLink from '../../ui/atoms/NavLink'
import ModalOverlay from '../molecules/ModalOverlay'
import media from '../../global/layout/media'

const MenuPanel = styled.div`
    max-width: 240px;
    background-color: ${th('colorBackground')}
    height: 100%;
`

const MenuItem = styled(Box)`
  border-top: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  height: ${th('space.6')};
  &:first-child {
    border: none;
  }
`
const BurgerWrapper = styled(Box)`
  display: inline;
  ${media.mobileUp`
    display: none;
  `};
`

class BurgerMenu extends React.Component {
  state = {
    menuOpen: false,
  }
  render() {
    const { menuItems } = this.props
    return (
      <BurgerWrapper ml={3}>
        <ButtonAsIconWrapper
          data-test-id="burger-menu-expand"
          onClick={() => this.setState({ menuOpen: true })}
        >
          <Icon iconName="Menu" overrideName="@pubsweet-pending.AppBar.Menu" />
        </ButtonAsIconWrapper>
        <ModalOverlay open={this.state.menuOpen} transparentBackground>
          <MenuPanel>
            <MenuItem p={3}>
              <CrossIconButton
                data-test-id="burger-menu-collapse"
                onClick={() => this.setState({ menuOpen: false })}
              />
            </MenuItem>
            {menuItems &&
              menuItems.map(item => (
                <MenuItem key={item.link} p={3}>
                  <NavLink exact to={item.link}>
                    {item.label}
                  </NavLink>
                </MenuItem>
              ))}
          </MenuPanel>
        </ModalOverlay>
      </BurgerWrapper>
    )
  }
}

BurgerMenu.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }),
  ),
}

BurgerMenu.defaultProps = {
  menuItems: [],
}
export default BurgerMenu
