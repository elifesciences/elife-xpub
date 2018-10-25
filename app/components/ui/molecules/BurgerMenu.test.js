import React from 'react'
import { shallow } from 'enzyme'
import BurgerMenu from './BurgerMenu'
import NavLink from '../atoms/NavLink'

const menuConfig = [
  { label: 'Dashboard', link: '/' },
  { label: 'Author guide', link: '/author' },
  { label: 'Reviewer guide', link: '/reviewer' },
  { label: 'Contact us', link: '/contact' },
]
const wrapper = shallow(<BurgerMenu menuItems={menuConfig} />)
describe('BurgerMenu Component', () => {
  it('mounts with menu closed', () => {
    expect(wrapper.state().menuOpen).toEqual(false)
  })
  it('menu opens when burger clicked', () => {
    wrapper
      .find('[data-test-id="burger-menu-expand"]')
      .at(0)
      .simulate('click')
    expect(wrapper.state().menuOpen).toEqual(true)
  })
  it('menu closed when cross clicked', () => {
    wrapper
      .find('[data-test-id="burger-menu-collapse"]')
      .at(0)
      .simulate('click')
    expect(wrapper.state().menuOpen).toEqual(false)
  })
  it('correctly creates NavLinks from menuItems prop', () => {
    menuConfig.forEach((config, index) => {
      expect(
        wrapper
          .find(NavLink)
          .at(index)
          .props().to,
      ).toEqual(config.link)
      expect(
        wrapper
          .find(NavLink)
          .at(index)
          .props().children,
      ).toEqual(config.label)
    })
  })
})
