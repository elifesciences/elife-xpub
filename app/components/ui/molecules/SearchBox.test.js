import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { escapeRegExp } from 'lodash'
import theme from '@elifesciences/elife-theme'

import SearchBox from './SearchBox'

const searchOptions = [
  { value: 'first option' },
  { value: 'final option' },
  { value: 'second option' },
]

const mockFilter = jest.fn((options, searchValue, field) => {
  if (!searchValue) return []

  const inputValue = searchValue.trim().toLowerCase()
  if (!inputValue) return []

  return options.filter(option =>
    option[field].toLowerCase().includes(inputValue),
  )
})

const mockMatchIndex = jest.fn((inputValue, option) => {
  const re = new RegExp(escapeRegExp(inputValue))
  const match = re.exec(option.toLowerCase())
  if (match) return match.index
  return -1
})

function makeWrapper() {
  return mount(
    <ThemeProvider theme={theme}>
      <SearchBox
        filterFunction={mockFilter}
        getMatchIndex={mockMatchIndex}
        onSubmit={jest.fn()}
        options={searchOptions}
      />
    </ThemeProvider>,
  )
}

const wrapper = makeWrapper()

describe('SearchBox component tests', () => {
  it('renders an input field', () => {
    expect(wrapper.find('input')).toHaveLength(1)
  })

  it('has search icon', () => {
    expect(wrapper.find('[data-test-id="search-icon"]')).toHaveLength(1)
  })

  it.each([[1, 'option'], [2, 'f'], [3, 'xyz'], [4, '']])(
    'typing something will show suggestions based on filtering function, test %i',
    (index, searchValue) => {
      /**
       * these tests make the assumption that suggestions will
       * be correctly rendered from the state of the component
       *
       * in the future this should be changed to check for the
       * list of rendered suggestions directly
       */
      const expectedSuggestions = mockFilter(
        searchOptions,
        searchValue,
        'value',
      )
      wrapper
        .find('input')
        .simulate('change', { target: { value: searchValue } })
      const receivedSuggestions = wrapper.find(SearchBox).instance().state
        .suggestions
      expect(receivedSuggestions).toEqual(expectedSuggestions)
    },
  )

  it('does nothing when clicking on X icon and nothing is typed', () => {
    wrapper.find('[data-test-id="cross-icon"]').simulate('click')
    expect(wrapper.find('input').props().value).toEqual('')
  })

  it('clears thes input field when x icon is clicked after typing something', () => {
    wrapper.find('input').simulate('change', { target: { value: 'something' } })
    wrapper.find('[data-test-id="cross-icon"]').simulate('click')
    expect(wrapper.find('input').props().value).toEqual('')
  })
})
