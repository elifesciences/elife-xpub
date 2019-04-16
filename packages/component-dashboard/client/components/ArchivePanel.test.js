import React from 'react'
import { shallow } from 'enzyme'
import ArchivePanel from './ArchivedPanel'

describe('ArchivePanel', () => {
  it('displays empty message when no manuscripts are passed', () => {
    const noManuscriptWrapper = shallow(<ArchivePanel />)
    expect(noManuscriptWrapper.text()).toEqual(
      'You currently have no archived submissions',
    )
  })
  it('displays empty message when empty manuscripts is passed', () => {
    const emptyManuscriptWrapper = shallow(<ArchivePanel manuscripts={[]} />)
    expect(emptyManuscriptWrapper.text()).toEqual(
      'You currently have no archived submissions',
    )
  })
})
