import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import theme from '@elifesciences/elife-theme'
import AppBar, { AppBarLink } from './AppBar'

const makeWrapper = props =>
  mount(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <AppBar {...props} />
      </MemoryRouter>
    </ThemeProvider>,
  )

describe('AppBar', () => {
  it('generates the correct number of links from menuItems prop', () => {
    let wrapper = makeWrapper({
      user: {},
      menuItems: [{ label: 'a', link: '/a' }, { label: 'b', link: '/b' }],
    })

    expect(wrapper.find('[data-test-id="app-bar-menu"] a')).toHaveLength(2)
    wrapper = makeWrapper({
      user: {},
      menuItems: [
        { label: 'a', link: '/a' },
        { label: 'b', link: '/b' },
        { label: 'c', link: '/c' },
      ],
    })
    expect(wrapper.find('[data-test-id="app-bar-menu"] a')).toHaveLength(3)
  })

  it('correctly creates AppBarLinks from menuItems prop', () => {
    const menuConfig = [
      { label: 'a', link: '/a' },
      { label: 'b', link: '/b' },
      { label: 'c', link: '/c' },
    ]
    const wrapper = makeWrapper({ user: {}, menuItems: menuConfig })

    menuConfig.forEach((config, index) => {
      const link = wrapper.find(AppBarLink).at(index)
      expect(link.props().to).toEqual(config.link)
      expect(link.props().children).toEqual(config.label)
    })
  })
})
