import React from 'react'
import { shallow, mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from 'react-apollo/test-utils'
import theme from '@elifesciences/elife-theme'

import DashboardContent from './DashboardContent'

const submissionViewStates = [
  {
    label: '1st',
    component: <div>Oh hey</div>,
  },
  {
    label: '2nd',
    component: <div>Second Tab</div>,
  },
]

const makeShallowWrapper = () =>
  shallow(<DashboardContent submissionViewStates={submissionViewStates} />)

const makeMountedWrapper = () =>
  mount(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <MockedProvider>
          <DashboardContent submissionViewStates={submissionViewStates} />
        </MockedProvider>
      </MemoryRouter>
    </ThemeProvider>,
  )

describe('Dashboard page', () => {
  it('selected index is updated when tab is selected', () => {
    const wrapper = makeShallowWrapper()
    const randomInteger = Math.floor(Math.random() * 100)
    wrapper.instance().onTabSelect(randomInteger)
    expect(wrapper.state().selectedIndex).toEqual(randomInteger)
  })

  it('number of options in navigation dropdown are the same as the number of tabs displayed', () => {
    const wrapper = makeMountedWrapper()
    const dropdownOptions = wrapper
      .find('NavigationDropdown')
      .at(0)
      .props().options
    const numTabs = wrapper.find('Tab').length
    expect(dropdownOptions).toHaveLength(numTabs)
  })

  it('for each tab, an associated panel is also rendered', () => {
    const wrapper = makeMountedWrapper()
    const tabs = wrapper.find('Tab').map(tab => tab.text())
    tabs.forEach(tab =>
      expect(wrapper.find(`[data-test-id="${tab.toLowerCase()}"]`)),
    )
  })
})
