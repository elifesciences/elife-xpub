import React from 'react'
import { mount } from 'enzyme'
import { NavLink, MemoryRouter } from 'react-router-dom'
import StaticPage from '.'

const makeWrapper = props =>
  mount(
    <MemoryRouter initialEntries={['/']}>
      <StaticPage {...props} />
    </MemoryRouter>,
  )

describe('SideNavComponent', () => {
  const wrapper = makeWrapper({
    navList: [
      { label: 'Contact eLife', link: '/' },
      { label: 'Editorial staff', link: '/editorial' },
      { label: 'Production staff', link: '/production' },
    ],
  })
  it('shows the correct number of nav links when passed navigation config', () => {
    expect(wrapper.find(NavLink)).toHaveLength(3)
  })
})
