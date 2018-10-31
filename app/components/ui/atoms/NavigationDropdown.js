import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import Select, { components } from 'react-select'

import Icon from '../atoms/Icon'

const DropdownArrow = props => (
  <Icon iconName="ChevronDown" overrideName="dropdownArrow" {...props} />
)

class NavigationDropdown extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedValue: this.props.initialValue,
    }

    this.customReactSelectStyles = {
      menuList: (base, state) => ({
        ...base,
        padding: 0,
      }),
      menu: (base, { placement }) => ({
        ...base,
        // remove default space between control & menu
        marginBottom: 0,
        // leave room for the bottom border of the Control component to be visible on focus
        marginTop: this.props.theme.borderWidth,
      }),
      option: (base, { isSelected, isFocused }) => ({
        ...base,
        backgroundColor: this.props.theme.colorBackground,
        ':active': {
          backgroundColor: this.props.theme.colorBackground,
        },
        color: isSelected
          ? this.props.theme.colorText
          : this.props.theme.colorTextSecondary,
        paddingTop: this.props.theme.space[3],
        paddingBottom: this.props.theme.space[3],
      }),
      control: (base, { isFocused }) => ({
        ...base,
        borderRadius: 0,
        border: 'none',
        boxShadow: 'none',
        minHeight: this.props.theme.space[6],
      }),
      dropdownIndicator: (base, state) => ({
        ...base,
        transition: 'all .2s ease',
        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
      }),
    }
  }

  handleSelection = selectedOption => {
    this.setState({ selectedValue: selectedOption.value })
    this.props.onSelection(selectedOption)
  }

  render() {
    const { onChange, options, selectedValue } = this.props

    const CustomDropdownIndicator = props => (
      <components.DropdownIndicator {...props}>
        <DropdownArrow />
      </components.DropdownIndicator>
    )

    return (
      <Select
        components={{
          IndicatorSeparator: null,
          DropdownIndicator: CustomDropdownIndicator,
        }}
        getOptionLabel={({ label }) => label}
        getOptionValue={({ value }) => value}
        isSearchable={false}
        maxMenuHeight={1200} // longer than any phone screen
        onChange={this.handleSelection}
        options={options}
        placeholder=""
        styles={this.customReactSelectStyles}
        value={options.filter(
          ({ value }) => value === this.state.selectedValue,
        )}
      />
    )
  }
}

NavigationDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  initialValue: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired,
}

export default withTheme(NavigationDropdown)
