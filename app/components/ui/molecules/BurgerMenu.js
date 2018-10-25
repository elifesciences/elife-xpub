import React from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'
import Icon from '../atoms/Icon'
import ButtonAsIconWrapper from '../atoms/ButtonAsIconWrapper'
import CrossIconButton from '../atoms/CrossIconButton'
import ModalOverlay from '../molecules/ModalOverlay'

const MenuPanel = styled.div`
    max-width: 240px;
    background-color: ${th('colorBackground')}
    height: 100%;
`

class BurgerMenu extends React.Component {
  state = {
    menuOpen: false,
  }
  render() {
    return (
      <React.Fragment>
        <ButtonAsIconWrapper onClick={() => this.setState({ menuOpen: true })}>
          <Icon iconName="Menu" overrideName="@pubsweet-pending.AppBar.Menu" />
        </ButtonAsIconWrapper>
        <ModalOverlay open={this.state.menuOpen} transparentBackground>
          <MenuPanel>
            <Box p={3}>
              <CrossIconButton
                onClick={() => this.setState({ menuOpen: false })}
              />
            </Box>
          </MenuPanel>
        </ModalOverlay>
      </React.Fragment>
    )
  }
}

export default BurgerMenu
