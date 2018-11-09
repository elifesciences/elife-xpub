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

describe('Dashboard page', () => {
  const shallowWrapper = shallow(
    <DashboardContent submissionViewStates={submissionViewStates} />,
  )
  const mountedWrapper = mount(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <MockedProvider>
          <DashboardContent submissionViewStates={submissionViewStates} />
        </MockedProvider>
      </MemoryRouter>
    </ThemeProvider>,
  )

  it('selected index is updated when tab is selected', () => {
    const randomInteger = Math.floor(Math.random() * 100)
    shallowWrapper.instance().onTabSelect(randomInteger)
    expect(shallowWrapper.state().selectedIndex).toEqual(randomInteger)
  })

  it('Tabs and/or dashboard list items correspond to props passed in', () => {
    const tabs = mountedWrapper.find('Tab')
    const dropdownOptions = mountedWrapper
      .find('NavigationDropdown')
      .at(0)
      .props().options
    expect(tabs).toHaveLength(submissionViewStates.length)
    expect(dropdownOptions).toHaveLength(submissionViewStates.length)

    tabs.map((tab, tabIndex) =>
      expect(tab.text()).toEqual(submissionViewStates[tabIndex].label),
    )
  })

  it('number of options in navigation dropdown are the same as the number of tabs displayed', () => {
    const dropdownOptions = mountedWrapper
      .find('NavigationDropdown')
      .at(0)
      .props().options
    const numTabs = mountedWrapper.find('Tab').length
    expect(dropdownOptions).toHaveLength(numTabs)
  })

  it('for each tab, an associated panel is also rendered', () => {
    const tabs = mountedWrapper.find('Tab').map(tab => tab.text())
    tabs.forEach(tab =>
      expect(mountedWrapper.find(`[data-test-id="${tab.toLowerCase()}"]`)),
    )
  })
})
