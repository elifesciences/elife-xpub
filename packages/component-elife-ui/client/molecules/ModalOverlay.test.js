import React from 'react'
import { render, cleanup } from '@testing-library/react'
import theme from '@elifesciences/elife-theme'
import { ThemeProvider } from 'styled-components'
import { MockedProvider } from 'react-apollo/test-utils'
import 'jest-dom/extend-expect'
import ModalOverlay from './ModalOverlay'

theme.transitionDuration = '0.2s'

const setupProvider = ({ children }) => (
  <ThemeProvider theme={theme}>
    <MockedProvider>{children}</MockedProvider>
  </ThemeProvider>
)

describe('ModalOverlay', () => {
  it('should disable scrolling on body element when open', () => {
    const { baseElement, rerender } = render(
      <ModalOverlay open={false} transparentBackground>
        Modal Content
      </ModalOverlay>,
      { wrapper: setupProvider },
    )
    rerender(
      <ModalOverlay open transparentBackground>
        Modal Content
      </ModalOverlay>,
      { wrapper: setupProvider },
    )

    expect(baseElement).toHaveStyle(`overflow: hidden`)

    cleanup()
  })

  it('should enable scrolling on body element when closed', () => {
    const { baseElement } = render(
      <ModalOverlay open={false} transparentBackground>
        Modal Content
      </ModalOverlay>,
      { wrapper: setupProvider },
    )

    expect(baseElement).not.toHaveStyle(`overflow: hidden`)

    cleanup()
  })

  it('should enable scrolling on body element when unmounted', () => {
    const { baseElement, rerender, unmount } = render(
      <ModalOverlay open={false} transparentBackground>
        Modal Content
      </ModalOverlay>,
      { wrapper: setupProvider },
    )
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
