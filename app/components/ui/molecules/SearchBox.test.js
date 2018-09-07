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

function filterFunction(options, searchValue, field) {
  if (!searchValue) return options

  const inputValue = searchValue.trim().toLowerCase()
  if (!inputValue) return options

  return options.filter(option =>
    option[field].toLowerCase().includes(inputValue),
  )
}

function getMatchIndex(inputValue, option) {
  const re = new RegExp(escapeRegExp(inputValue))
  const match = re.exec(option.toLowerCase())
  if (match) return match.index
  return -1
}

function makeWrapper() {
  return mount(
    <ThemeProvider theme={theme}>
      <SearchBox
        filterFunction={filterFunction}
        getMatchIndex={getMatchIndex}
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
    expect(wrapper.find('#search-icon')).toHaveLength(1)
  })

  it("doesn't show any suggestions on empty input", () => {
    wrapper.find('input').simulate('change', { target: { value: '' } })
    expect(wrapper.find(SearchBox).instance().state.suggestions).toEqual([])
  })

  function compareSuggestions(searchValue) {
    const expectedSuggestions = filterFunction(
      searchOptions,
      searchValue,
      'value',
    )
    wrapper.find('input').simulate('change', { target: { value: searchValue } })
    const receivedSuggestions = wrapper.find(SearchBox).instance().state
      .suggestions
    expect(receivedSuggestions).toEqual(expectedSuggestions)
  }

  it('typing something will show suggestions based on filtering function, test 1', () => {
    compareSuggestions('option')
  })

  it('typing something will show suggestions based on filtering function, test 2', () => {
    compareSuggestions('f')
  })

  it('typing something will show suggestions based on filtering function, test 3', () => {
    compareSuggestions('xyz')
  })
})
