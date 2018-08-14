import React from 'react'
import styled from 'styled-components'
import Autosuggest from 'react-autosuggest'
import { th } from '@pubsweet/ui-toolkit'

import Icon from '../atoms/Icon'
import theme from './SearchBox.local.css'

const SearchIcon = props => (
  <Icon
    iconName="Search"
    overrideName="@pubsweet-pending.PeoplePicker.search"
    {...props}
  />
)

const StyledSearchIcon = styled(SearchIcon)`
  width: ${th('space.3')};
  height: ${th('space.3')};
  fill: ${th('colorTextSecondary')};
`

const Root = styled.div`
  position: relative;
`

const IconContainer = styled.div`
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  height: 100%;
`

class SearchBox extends React.Component {
  state = {
    value: '',
    suggestions: [],
  }
  onChange = (_, { newValue }) => {
    this.setState({
      value: newValue,
    })
  }
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    })
  }
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    })
  }

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length
    return inputLength === 0
      ? []
      : this.props.options.filter(option =>
          option.value.toLowerCase().includes(inputValue),
        )
  }
  getSuggestionValue = suggestion => suggestion.value
  renderSuggestion = suggestion => <div>{suggestion.value}</div>
  onKeyDown = event => {
    // key code for enter is 13
    if (event.keyCode === 13) {
      this.props.onSubmit(this.state.value)
    }
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
      <Root>
        <IconContainer>
          <StyledSearchIcon />
        </IconContainer>
        <Autosuggest
          getSuggestionValue={this.getSuggestionValue}
          inputProps={inputProps}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          renderSuggestion={this.renderSuggestion}
          suggestions={suggestions}
          theme={theme}
        />
      </Root>
    )
  }
}

export default SearchBox
