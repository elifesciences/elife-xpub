import React from 'react'
import { shallow, mount } from 'enzyme'
import theme from '@elifesciences/elife-theme'

import SubjectAreaDropdown from './SubjectAreaDropdown'

const handleChange = jest.fn()
const handleBlur = jest.fn()

const MyDropdown = (
  <SubjectAreaDropdown
    label="My label"
    name="My name"
    onBlur={handleBlur}
    onChange={handleChange}
    savedValues={[]}
    theme={theme}
  />
)

describe('SubjectAreaDropdown component', () => {
  it('renders label & select', () => {
    // dive is necessary because SubjectAreaDropdown is wrapped by withTheme
    const wrapper = shallow(MyDropdown).dive()
    expect(wrapper.html()).toContain('My label')
    expect(wrapper.find('[inputId="subject-area-select"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('No more than two subject areas')
  })

  describe('Integration with react-select', () => {
    let wrapper, selectWrapper, selectInput

    beforeEach(() => {
      jest.clearAllMocks()
      wrapper = mount(MyDropdown)
      selectWrapper = wrapper.find('Select')
      selectInput = selectWrapper.find('input')
    })

    const typeSubjectArea = letters => {
      // We need 2 steps to programmatically simulate typing in a letter
      // 1. Add a letter to the value of the input field (does not cause the dropdown to appear by itself)
      selectWrapper.props().onInputChange(letters)
      // 2. Open the dropdown
      selectInput.simulate('change')
    }

    it('focusing causes the dropdown to open & display every option', () => {
      // typing nothing into the field seems to be the only way to programmatically focus react-select)
      typeSubjectArea('')
      expect(wrapper.find('Menu').exists()).toBe(true)
      expect(wrapper.find('Option')).toHaveLength(17)
    })

    it('an option can be selected from the dropdown', () => {
      typeSubjectArea('b')
      selectInput.simulate('keyDown', { keyCode: 9, key: 'Tab' })
      expect(handleChange.mock.calls).toHaveLength(1)
      // MultiValue = a "tag" (i.e. selected option) in react-select
      expect(wrapper.find('MultiValue')).toHaveLength(1)
      expect(wrapper.find('ValueContainer').html()).toContain(
        'Biochemistry and Chemical Biology',
      )
    })

    it('when an option is chosen, the menu closes', () => {
      typeSubjectArea('b')
      selectInput.simulate('keyDown', { keyCode: 13, key: 'Enter' })
      expect(wrapper.find('Menu').exists()).toBe(false)
      expect(wrapper.find('MultiValue')).toHaveLength(1)
    })

    it('dropdown indicator disappears when 2 options are selected', () => {
      typeSubjectArea('b')
      selectInput.simulate('keyDown', { keyCode: 9, key: 'Tab' })
      typeSubjectArea('c')
      selectInput.simulate('keyDown', { keyCode: 9, key: 'Tab' })
      expect(wrapper.text()).not.toContain('DropdownIndicator')
    })

    it('selection/deselection of 2 items triggers success message to show/hide', () => {
      typeSubjectArea('b')
      selectInput.simulate('keyDown', { keyCode: 9, key: 'Tab' })
      typeSubjectArea('c')
      selectInput.simulate('keyDown', { keyCode: 9, key: 'Tab' })
      expect(wrapper.text()).toContain('No more than two subject areas')

      const crossOnFirstTag = wrapper.find('MultiValueRemove').at(0)
      crossOnFirstTag.simulate('click')
      expect(wrapper.find('MultiValue')).toHaveLength(1)
      expect(wrapper.text()).not.toContain('No more than two subject areas')
    })

    it('typing filters list of options based on first letter(s)', () => {
      typeSubjectArea('c')
      wrapper.find('Option').forEach(option => {
        const optionText = option.childAt(0).text()
        const wordStartsWithC = new RegExp(/^c/i)
        expect(optionText).toMatch(wordStartsWithC)
      })

      typeSubjectArea('ce')
      wrapper.find('Option').forEach(option => {
        const optionText = option.childAt(0).text()
        const wordStartsWithCe = new RegExp(/^ce/i)
        expect(optionText).toMatch(wordStartsWithCe)
      })
    })
  })
})
