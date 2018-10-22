import React from 'react'
import { mount } from 'enzyme'
import { Link, MemoryRouter } from 'react-router-dom'
import SideNavLayout from './SideNavLayout'

const makeWrapper = props =>
  mount(
    <MemoryRouter initialEntries={['/']}>
      <SideNavLayout {...props} />
    </MemoryRouter>,
  )

describe('SideNavComponent', () => {
  it('shows no navigation links when no navList is passed', () => {
    const wrapper = makeWrapper()
    expect(wrapper.find(Link)).toHaveLength(0)
  })
  const wrapper = makeWrapper({
    navList: [
      { label: 'Contact eLife', link: '/', active: true },
      { label: 'Editorial staff', link: '/editorial' },
      { label: 'Production staff', link: '/production' },
    ],
  })
  it('shows the correct number of nav links when passed navigation config', () => {
    expect(wrapper.find(Link)).toHaveLength(3)
  })
  it('only gives nav links with config {active: true} a class of "active"', () => {
    expect(
      wrapper
        .find(Link)
        .at(0)
        .hasClass('active'),
    ).toEqual(true)
    expect(
      wrapper
        .find(Link)
        .at(1)
        .hasClass('active'),
    ).toEqual(false)
  })
})
