import React from 'react'
import styled from 'styled-components'
import Autosuggest from 'react-autosuggest'

import Icon from '../atoms/Icon'
import theme from './SearchBox.local.css'

const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0px;
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
      : this.props.options.filter(
          option => option.value.toLowerCase().search(inputValue) >= 0,
        )
  }
  getSuggestionValue = suggestion => suggestion.value
  renderSuggestion = suggestion => <div>{suggestion.value}</div>
  render() {
    const { value, suggestions } = this.state
    const inputProps = {
      placeholder: 'Search...',
      value,
      onChange: this.onChange,
    }
    return (
      <Root>
        <IconContainer>
          <Icon size={3}>Search</Icon>
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
