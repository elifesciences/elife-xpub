import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter, NavLink, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import theme from '@elifesciences/elife-theme'

import Layout from './Layout'

const navList = [
  {
    label: 'First label',
    link: `/static-page-name/first-sub-content-name`,
    component: () => (
      <MockContentComponent data-test-id="first-sub-content-component" />
    ),
  },
  {
    label: 'Second label',
    link: `/static-page-name/second-sub-content-name`,
    component: () => (
      <MockContentComponent data-test-id="second-sub-content-component" />
    ),
  },
  {
    label: 'Third label',
    link: `/static-page-name/third-sub-content-name`,
    component: () => (
      <MockContentComponent data-test-id="third-sub-content-component" />
    ),
  },
]

const makeWrapper = ({ path }) =>
  mount(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[`${path}`]}>
        <Route
          render={history => <Layout history={history} navList={navList} />}
        />
      </MemoryRouter>
    </ThemeProvider>,
  )

const MockContentComponent = ({ dataTestId }) => (
  <div data-test-id={dataTestId} />
)

describe('SideNavComponent', () => {
  describe('Initial page', () => {
    const wrapper = makeWrapper({ path: '/static-page-name' })

    it('shows the correct number of nav links when passed navigation config', () => {
      expect(wrapper.find(NavLink)).toHaveLength(navList.length)
    })

    it('navigating to the overall static page renders (only) the first sub-content component in the nav list', () => {
      expect(
        wrapper.find('[data-test-id="first-sub-content-component"]').exists(),
      ).toBe(true)
      expect(
        wrapper.find('[data-test-id="second-sub-content-component"]').exists(),
      ).toBe(false)
      expect(
        wrapper.find('[data-test-id="third-sub-content-component"]').exists(),
      ).toBe(false)
    })
  })

  describe('Sub-routes', () => {
    const wrapper = makeWrapper({ path: navList[1].link })

    it('renders (only) the second sub-content component when the second link is clicked', () => {
      expect(
        wrapper.find('[data-test-id="first-sub-content-component"]').exists(),
      ).toBe(false)
      expect(
        wrapper.find('[data-test-id="second-sub-content-component"]').exists(),
      ).toBe(true)
      expect(
        wrapper.find('[data-test-id="third-sub-content-component"]').exists(),
      ).toBe(false)
    })
  })
})
