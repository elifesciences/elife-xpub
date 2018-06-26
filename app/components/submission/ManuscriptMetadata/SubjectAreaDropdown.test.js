import React from 'react'
import { shallow, mount } from 'enzyme'
import theme from '@elifesciences/elife-theme'

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
  it('renders label & select', () => {
    const wrapper = shallow(MyDropdown).dive() // dive is necessary because SubjectAreaDropdown is wrapped by withTheme
    expect(wrapper.contains('My label')).toBe(true)
    expect(wrapper.find('[inputId="subject-area-select"]').exists()).toEqual(
      true,
    )
    expect(wrapper.contains('No more than two subject areas')).toBe(false)
  })

  describe('Integration with react-select', () => {
    let wrapper, selectWrapper, selectInput

    beforeEach(() => {
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
      typeSubjectArea('') // typing nothing into the field seems to be the only way to programmatically focus react-select)
      expect(wrapper.find('Menu').exists()).toEqual(true)
      expect(wrapper.find('Option')).toHaveLength(17)
    })

    it('an option can be selected from the dropdown', () => {
      typeSubjectArea('b')
      selectInput.simulate('keyDown', { keyCode: 9, key: 'Tab' })
      expect(onChange.mock.calls).toHaveLength(1)
      expect(wrapper.find('Menu').exists()).toEqual(false)
      expect(wrapper.find('MultiValue')).toHaveLength(1) // MultiValue = a "tag" (i.e. selected option) in react-select
      expect(
        wrapper
          .find('MultiValue')
          .contains('Biochemistry and Chemical Biology'),
      ).toBe(true)
    })

    it('2 options can be selected from the dropdown', () => {
      typeSubjectArea('b')
      selectInput.simulate('keyDown', { keyCode: 9, key: 'Tab' })
      typeSubjectArea('c')
      selectInput.simulate('keyDown', { keyCode: 9, key: 'Tab' })
      expect(wrapper.find('MultiValue')).toHaveLength(2)
      expect(wrapper.find('MultiValue').contains('Cancer Biology')).toBe(true)

      // selectWrapper.props().onInputChange('E')
      // selectInput.simulate('change')
      // expect(wrapper.contains('Menu')).toBe(false)
    })

    it('selecting 2 options disables further selection', () => {
      typeSubjectArea('b')
      selectInput.simulate('keyDown', { keyCode: 9, key: 'Tab' })
      typeSubjectArea('c')
      selectInput.simulate('keyDown', { keyCode: 9, key: 'Tab' })
      expect(wrapper.contains('DropdownIndicator')).toBe(false)
    })

    it('selection/deselection of 2 items triggers success message to show/hide', () => {
      typeSubjectArea('b')
      selectInput.simulate('keyDown', { keyCode: 9, key: 'Tab' })
      typeSubjectArea('c')
      selectInput.simulate('keyDown', { keyCode: 9, key: 'Tab' })
      expect(wrapper.contains('No more than two subject areas')).toBe(true)

      const crossOnFirstTag = wrapper.find('MultiValueRemove').at(0)
      crossOnFirstTag.simulate('click')
      expect(wrapper.find('MultiValue')).toHaveLength(1)
      expect(wrapper.contains('No more than two subject areas')).toBe(false)
    })

    it('typing filters list of options based on first letter(s)', () => {
      typeSubjectArea('c')
      const totalStartingWithC = wrapper.find('Option').length
      expect(totalStartingWithC).toBeLessThan(17)
      wrapper.find('Option').forEach(option => {
        const optionText = option.childAt(0).text()
        const wordStartsWithC = new RegExp(/^[cC]\w+/)
        expect(optionText).toMatch(wordStartsWithC)
      })

      typeSubjectArea('ce')
      const totalStartingWithCe = wrapper.find('Option').length
      expect(totalStartingWithCe).toBeLessThan(totalStartingWithC)
      wrapper.find('Option').forEach(option => {
        const optionText = option.childAt(0).text()
        const wordStartsWithCe = new RegExp(/^[ceCe]\w+/)
        expect(optionText).toMatch(wordStartsWithCe)
      })
    })
  })
})
