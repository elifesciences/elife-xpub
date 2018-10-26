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

const MenuPanel = styled.div`
    max-width: 240px;
    background-color: ${th('colorBackground')}
    height: 100%;
`

const MenuItem = styled(Box).attrs({ p: 3 })`
  border-top: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  height: ${th('space.6')};
  &:first-child {
    border: none;
  }
`

class BurgerMenu extends React.Component {
  state = {
    menuOpen: false,
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = event => {
    if (this.menuRef && !this.menuRef.contains(event.target)) {
      this.setState({ menuOpen: false })
    }
  }

  render() {
    const { menuItems } = this.props
    return (
      <React.Fragment>
        <ButtonAsIconWrapper
          data-test-id="burger-menu-expand"
          onClick={() => this.setState({ menuOpen: true })}
        >
          <Icon iconName="Menu" overrideName="@pubsweet-pending.AppBar.Menu" />
        </ButtonAsIconWrapper>
        <ModalOverlay open={this.state.menuOpen} transparentBackground>
          <MenuPanel
            innerRef={node => {
              this.menuRef = node
            }}
          >
            <MenuItem>
              <CrossIconButton
                data-test-id="burger-menu-collapse"
                onClick={() => this.setState({ menuOpen: false })}
              />
            </MenuItem>
            {menuItems &&
              menuItems.map(item => (
                <MenuItem key={item.link}>
                  <NavLink
                    exact
                    onClick={() => this.setState({ menuOpen: false })}
                    to={item.link}
                  >
                    {item.label}
                  </NavLink>
                </MenuItem>
              ))}
          </MenuPanel>
        </ModalOverlay>
      </React.Fragment>
    )
  }
}

BurgerMenu.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }),
  ).isRequired,
}
export default BurgerMenu
