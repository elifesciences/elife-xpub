import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

class NavigationDropdown extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: this.props.defaultValue,
    }
  }

  render() {
    const { options } = this.props

    return (
      <Select
        getOptionLabel={({ label }) => label}
        getOptionValue={({ value }) => value}
        onChange={({ value }) => this.setState({ value })}
        options={options.filter(({ value }) => value !== this.state.value)}
        placeholder=""
        value={options.filter(({ value }) => value === this.state.value)}
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
  defaultValue: PropTypes.string.isRequired,
}

export default NavigationDropdown
