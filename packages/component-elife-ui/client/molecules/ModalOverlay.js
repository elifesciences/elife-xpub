import React from 'react'
import styled, { withTheme } from 'styled-components'
import { CSSTransition } from 'react-transition-group'
import ScrollLock from 'react-scrolllock'
import PropTypes from 'prop-types'
import { th } from '@pubsweet/ui-toolkit'

const Root = styled.div``

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1500;
  background: ${props =>
    props.transparentBackground
      ? `rgba(0, 0, 0, 0.8)`
      : props.theme.colorBackground};
  transition: opacity ${th('transitionDuration')}
    ${th('transitionTimingFunction')};
  overflow-y: auto;

  &.modal-enter,
  &.modal-exit-active {
    opacity: 0;
  }

  &.modal-enter-active {
    opacity: 1;
  }
`

function cssTimeToMilliseconds(timeString) {
  const num = parseFloat(timeString, 10)
  const unit = timeString.match(/m?s/)

  switch (unit && unit[0]) {
    case 's':
      return num * 1000
    case 'ms':
      return num
    default:
      return 0
  }
}

class ModalOverlay extends React.Component {
  constructor(props) {
    super(props)
    this.overlay = React.createRef()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.open !== this.props.open) {
      if (this.props.open) {
        document.documentElement.style.overflow = 'hidden'
        document.body.style.overflow = 'hidden'
      } else {
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
      }
    }
  }

  render() {
    const { children, open, theme, transparentBackground } = this.props
    return (
      <Root aria-live="assertive">
        <CSSTransition
          classNames="modal"
          in={open}
          mountOnEnter
          timeout={cssTimeToMilliseconds(theme.transitionDuration)}
          unmountOnExit
        >
          <Container
            ref={this.overlay}
            transparentBackground={transparentBackground}
          >
            {children}
            {this.overlay.current && (
              <ScrollLock touchScrollTarget={this.overlay.current} />
            )}
          </Container>
        </CSSTransition>
      </Root>
    )
  }
}

ModalOverlay.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  transparentBackground: PropTypes.bool.isRequired,
}

export default withTheme(ModalOverlay)
