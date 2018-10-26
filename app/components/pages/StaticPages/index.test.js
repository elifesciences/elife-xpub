import React from 'react'
import { mount } from 'enzyme'
import { NavLink, MemoryRouter } from 'react-router-dom'
import StaticPage from '.'

const makeWrapper = props =>
  mount(
    <MemoryRouter initialEntries={['./static-page-name']}>
      <StaticPage {...props} />
    </MemoryRouter>,
  )

const MockContentComponent = ({ dataTestId }) => (
  <div data-test-id={dataTestId} />
)

describe('SideNavComponent', () => {
  const navList = [
    {
      label: 'First label',
      link: '/static-page-name/first-sub-content-name',
      component: () => (
        <MockContentComponent data-test-id="first-sub-content-component" />
      ),
    },
    {
      label: 'Second label',
      link: '/static-page-name/second-sub-content-name',
      component: () => (
        <MockContentComponent data-test-id="second-sub-content-component" />
      ),
    },
    {
      label: 'Third label',
      link: '/static-page-name/third-sub-content-name',
      component: () => (
        <MockContentComponent data-test-id="third-sub-content-component" />
      ),
    },
  ]
  const wrapper = makeWrapper({ navList })

  it('shows the correct number of nav links when passed navigation config', () => {
    expect(wrapper.find(NavLink)).toHaveLength(navList.length)
  })
})
