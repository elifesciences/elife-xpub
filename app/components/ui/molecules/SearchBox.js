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
  canSelectMore = () => {
    const { selectedOption } = this.state
    if (selectedOption) {
      if (selectedOption.length > 1) {
        return false
      }
    }
    return true
  }
  isMenuOpen = () => {
    const { inputValue } = this.state
    if (this.canSelectMore()) {
      return inputValue.length > 0
    }
    return false
  }
  isSearchable = () => this.canSelectMore()
  render() {
    const customStyles = {
      control: (base, state) => ({
        ...base,
        marginBottom: '28px',
      }),
      valueContainer: (base, state) => ({
        ...base,
        padding: this.props.theme.space[2],
        height: this.props.theme.space[5],
      }),
      multiValue: (base, state) => ({
        ...base,
        backgroundColor: this.props.theme.colorPrimary,
        color: this.props.theme.colorTextReverse,
        marginRight: '20px',
        marginTop: '96px',
        marginLeft: '-12px',
      }),
      multiValueLabel: (base, state) => ({
        ...base,
        color: this.props.theme.colorTextReverse,
        fontSize: this.props.theme.fontSizeBase,
        padding: '8px 4px 8px 8px',
        paddingLeft: '8px',
      }),
      multiValueRemove: (base, state) => ({
        ...base,
        padding: `0 ${this.props.theme.gridUnit} 0 0`,
        backgroundColor: this.props.theme.colorPrimary,
        ':hover': {
          cursor: 'pointer',
          backgroundColor: this.props.theme.colorPrimary,
          color: this.props.theme.colorTextReverse,
        },
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
        isSearchable={this.isSearchable()}
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
