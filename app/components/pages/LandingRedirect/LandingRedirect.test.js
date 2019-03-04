import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import theme from '@elifesciences/elife-theme'
import LandingRedirect from './LandingRedirect'

const makeWrapper = props =>
  mount(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <LandingRedirect />
      </MemoryRouter>
    </ThemeProvider>,
  )

describe('LandingRedirect', () => {
  it('Contains a link to the Privacy and T&C pages in the footer', () => {
    const wrapper = makeWrapper()
    expect(wrapper.html()).toContain('href="https://elifesciences.org/terms"')
    expect(wrapper.html()).toContain('href="https://elifesciences.org/privacy"')
  })
  it('contains a button directing the user to the dashboard', () => {
    const wrapper = makeWrapper()
    expect(wrapper.find('ButtonLink').props().to).toBe('/')
  })
})
