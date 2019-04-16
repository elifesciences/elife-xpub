import React from 'react'
import { shallow } from 'enzyme'

import DashboardList from './DashboardList'
import DashboardListItem from './DashboardListItem'

describe('DashboardList', () => {
  it('displays empty message when no manuscripts are passed', () => {
    const noManuscriptWrapper = shallow(
      <DashboardList deleteSubmission={() => {}} />,
    )
    expect(noManuscriptWrapper.text()).toContain(
      'You currently have no active submissions',
    )
  })
  it('displays empty message when empty manuscripts is passed', () => {
    const emptyManuscriptWrapper = shallow(
      <DashboardList deleteSubmission={() => {}} manuscripts={[]} />,
    )
    expect(emptyManuscriptWrapper.text()).toContain(
      'You currently have no active submissions',
    )
  })
  it('renders a DashboardListItem for each of the entries in the manuscripts prop array', () => {
    const mockManuscripts = [
      { id: 1, meta: { title: 'a' } },
      { id: 2, meta: { title: 'b' } },
      { id: 3, meta: { title: 'c' } },
    ]
    const wrapper = shallow(
      <DashboardList
        deleteSubmission={() => {}}
        manuscripts={mockManuscripts}
      />,
    )
    expect(wrapper.find(DashboardListItem)).toHaveLength(mockManuscripts.length)
  })
})
