import React from 'react'
import { render, cleanup } from '@testing-library/react'
import theme from '@elifesciences/elife-theme'
import { ThemeProvider } from 'styled-components'
import { MockedProvider } from 'react-apollo/test-utils'
import 'jest-dom/extend-expect'
import ModalOverlay from './ModalOverlay'

const setupProvider = ({ children }) => (
  <ThemeProvider theme={theme}>
    <MockedProvider>{children}</MockedProvider>
  </ThemeProvider>
)

const factory = (props = {}) =>
  render(
    <ModalOverlay {...{ open: false, transparentBackground: true, ...props }}>
      Modal Content
    </ModalOverlay>,
    { wrapper: setupProvider },
  )

describe('ModalOverlay', () => {
  afterEach(() => cleanup())

  it('should disable scrolling on body element when open', () => {
    const { baseElement, rerender } = factory({ open: true })
    rerender(
      <ModalOverlay open transparentBackground>
        Modal Content
      </ModalOverlay>,
      { wrapper: setupProvider },
    )

    expect(baseElement).toHaveStyle(`overflow: hidden`)
  })

  it('should enable scrolling on body element when closed', () => {
    const { baseElement } = factory()

    expect(baseElement).not.toHaveStyle(`overflow: hidden`)
  })

  it('should enable scrolling on body element when unmounted', () => {
    const { baseElement, rerender, unmount } = factory()
    rerender(
      <ModalOverlay open transparentBackground>
        Modal Content
      </ModalOverlay>,
      { wrapper: setupProvider },
    )
    unmount()

    expect(baseElement).not.toHaveStyle(`overflow: hidden`)
  })
})
