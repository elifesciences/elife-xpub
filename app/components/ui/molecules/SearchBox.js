import React from 'react'
import styled, { withTheme } from 'styled-components'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { th } from '@pubsweet/ui-toolkit'

import Icon from '../atoms/Icon'

const IconContainer = styled.div`
  margin-right: ${th('space.2')};
`

const MyDropdownIndicator = ({ innerRef, innerProps }) => (
  <IconContainer>
    <Icon size={3} {...innerProps}>
      Search
    </Icon>
  </IconContainer>
)

class SearchBox extends React.Component {
  state = {
    selectedOption: null,
    inputValue: '',
  }
  inputChange = inputValue => {
    this.setState({ inputValue })
  }
  handleChange = selectedOption => {
    this.setState({ selectedOption })
  }
  isMenuOpen = () => {
    const { inputValue } = this.state
    return inputValue.length > 0
  }
  render() {
    const customStyles = {
      valueContainer: (base, state) => ({
        ...base,
        padding: this.props.theme.space[2],
        height: this.props.theme.space[5],
      }),
    }
    return (
      <Select
        components={{
          DropdownIndicator: MyDropdownIndicator,
          IndicatorSeparator: null,
          ClearIndicator: null,
        }}
        isMulti
        menuIsOpen={this.isMenuOpen()}
        onChange={this.handleChange}
        onInputChange={this.inputChange}
        options={this.props.options}
        placeholder="Search..."
        styles={customStyles}
        value={this.state.selectedOption}
      />
    )
  }
}

SearchBox.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
}

export default withTheme(SearchBox)
