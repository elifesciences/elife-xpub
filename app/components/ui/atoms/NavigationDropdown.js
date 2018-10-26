import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const NavigationDropdown = ({ options, ...props }) => (
  <Select options={options} />
)

NavigationDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default NavigationDropdown
