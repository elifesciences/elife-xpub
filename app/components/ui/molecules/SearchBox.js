import React from 'react'
import styled from 'styled-components'
import Autosuggest from 'react-autosuggest'
import { th } from '@pubsweet/ui-toolkit'
import { Flex, Box } from 'grid-styled'

import SearchButton from './SearchIconButton'

import Icon from '../atoms/Icon'

const CrossIcon = props => (
  <Icon
    iconName="X"
    overrideName="@pubsweet-pending.PeoplePicker.ClearSearch"
    {...props}
  />
)

const IconButton = styled.button.attrs({
  type: 'button',
})`
  background-color: transparent;
  border: none;
  line-height: 0;
  padding: 0;
`

const ClearSearchButton = ({ onClick, ...props }) => (
  <IconButton onClick={onClick} {...props}>
    <CrossIcon />
  </IconButton>
)

const StyledClearButton = styled(ClearSearchButton)`
  fill: ${th('colorTextSecondary')};
  border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  border-left: ${th('colorBackground')};
  &:focus {
    border-left: ${th('colorBorder')};
  }
`

const AutosuggestWrapper = styled(Box).attrs({
  width: 1,
})`
  position: relative;

  .react-autosuggest__input {
    border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
    border-right: ${th('colorBackground')};
    border-radius: ${th('borderRadius')} 0 0 ${th('borderRadius')};
    font-family: ${th('fontInterface')};
    font-size: ${th('fontSizeBase')};
    line-height: ${th('lineHeightBase')};
    padding: ${th('space.2')};
    height: ${th('space.5')};
    width: 100%;
  }

  .react-autosuggest__input::placeholder {
    color: ${th('colorTextPlaceholder')};
  }

  .react-autosuggest__input--focused {
    outline: none;
  }

  .react-autosuggest__input--open {
    border-radius: 0 0 ${th('borderRadius')} ${th('borderRadius')};
  }

  .react-autosuggest__suggestions-container {
    display: none;
  }

  .react-autosuggest__suggestions-container--open {
    background-color: ${th('colorBackground')};
    border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    display: block;

    font-family: ${th('fontInterface')};
    font-size: ${th('fontSizeBase')};
    position: absolute;
    width: 100%;
  }

  .react-autosuggest__suggestions-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .react-autosuggest__suggestion {
    cursor: pointer;
    padding: ${th('space.2')};
  }

  .react-autosuggest__suggestion--highlighted {
    background-color: ${th('colorPrimary')};
    color: ${th('colorTextReverse')};
  }
`

class SearchBox extends React.Component {
  state = {
    value: '',
    suggestions: [],
  }
  getSuggestionValue = suggestion => this.state.value
  onSuggestionsFetchRequested = ({ value }) => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length
    let suggestions = []
    if (inputLength !== 0) {
      suggestions = this.props.filterFunction(
        this.props.options,
        inputValue,
        'value',
      )
    }
    this.setState({
      suggestions,
    })
  }
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    })
  }
  onSuggestionSelected = (_, { suggestion }) => {
    this.setState(
      {
        value: suggestion.value,
      },
      () => this.handleSearch(),
    )
  }
  onChange = (_, { newValue }) => {
    this.setState({
      value: newValue,
    })
  }
  onKeyDown = event => {
    // key code for enter is 13
    if (event.keyCode === 13) {
      this.handleSearch()
    }
  }
  handleSearch = event => {
    this.props.onSubmit(this.state.value)
  }
  clearSearch = event => {
    this.setState(
      {
        value: '',
      },
      () => this.handleSearch(),
    )
  }
  renderSuggestion = suggestion => {
    const inputValue = this.state.value.trim().toLowerCase()
    const matchIndex = this.props.getMatchIndex(inputValue, suggestion.value)
    if (matchIndex < 0) {
      // this shouldn't happen/error
      return ''
    }
    const beforeMatch = suggestion.value.slice(0, matchIndex)
    const matched = suggestion.value.slice(
      matchIndex,
      matchIndex + inputValue.length,
    )
    const afterMatch = suggestion.value.slice(matchIndex + inputValue.length)
    return (
      <div>
        {beforeMatch}
        <b>{matched}</b>
        {afterMatch}
      </div>
    )
  }
  render() {
    const { value, suggestions } = this.state
    const inputProps = {
      placeholder: 'Search...',
      value,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
    }
    return (
      <Flex>
        <AutosuggestWrapper>
          <Autosuggest
            getSuggestionValue={this.getSuggestionValue}
            inputProps={inputProps}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            renderSuggestion={this.renderSuggestion}
            suggestions={suggestions}
          />
        </AutosuggestWrapper>
        <StyledClearButton onClick={this.clearSearch} />
        <SearchButton onClick={this.handleSearch} />
      </Flex>
    )
  }
}

export default SearchBox
