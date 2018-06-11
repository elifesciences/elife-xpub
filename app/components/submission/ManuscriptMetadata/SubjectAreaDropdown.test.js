import React from 'react'
import { shallow } from 'enzyme'
import theme from '@pubsweet/elife-theme'

import SubjectAreaDropdown from './SubjectAreaDropdown'

const onChange = jest.fn()

const MyDropdown = (
  <SubjectAreaDropdown
    label="My label"
    name="My name"
    onBlur={jest.fn()}
    onChange={onChange}
    savedValues={[]}
    theme={theme}
  />
)

describe('SubjectAreaDropdown component', () => {
  it('renders default form', () => {
    const wrapper = shallow(MyDropdown).dive() // dive is necessary because SubjectAreaDropdown is wrapped by withTheme
    expect(wrapper.contains('My label')).toBe(true)
  })
})
