import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'

class SubjectAreaDropdown extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOptions: [],
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  // https://github.com/JedWatson/react-select/blob/v2/src/Select.js
  // react-select exposes onChange: (ValueType, ActionMeta) => void
  handleChange = selectedOptions => {
    this.setState({ selectedOptions })
    if (this.props.onChange) this.props.onChange(selectedOptions)
  }

  handleBlur = e => {
    if (this.props.onBlur) this.props.onBlur(e)
  }

  render() {
    const { selectedOptions } = this.state
    const { label, name } = this.props

    return (
      <div>
        {/* htmlFor matches with react-select's inputId, which applies the correct id to the internal sub-component */}
        {/* eslint-disable-next-line jsx-a11y/label-has-for */}
        <label htmlFor="subject-area-select">{label}</label>
        <Select
          inputId="subject-area-select"
          isMulti
          name={name}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          options={[
            {
              value: 'structural-biology-molecular-biophysics',
              label: 'Structural Biology and Molecular Biophysics',
            },
            { value: 'plant-biology', label: 'Plant Biology' },
            {
              value: 'physics-living-systems',
              label: 'Physics of Living Systems',
            },
            { value: 'neuroscience', label: 'Neuroscience' },
            {
              value: 'microbiology-infectious-disease',
              label: 'Microbiology and Infectious Disease',
            },
            {
              value: 'immunology-inflammation',
              label: 'Immunology and Inflammation',
            },
            {
              value: 'human-biology-medicine',
              label: 'Human Biology and Medicine',
            },
            { value: 'genetics-genomics', label: 'Genetics and Genomics' },
            { value: 'evolutionary-biology', label: 'Evolutionary Biology' },
            {
              value: 'epidemiology-global-health',
              label: 'Epidemiology and Global Health',
            },
            { value: 'ecology', label: 'Ecology' },
            {
              value: 'developmental-biology-stem-cells',
              label: 'Developmental Biology and Stem Cells',
            },
            {
              value: 'computational-systems-biology',
              label: 'Computational and Systems Biology',
            },
            {
              value: 'chromosomes-gene-expression',
              label: 'Chromosomes and Gene Expression',
            },
            { value: 'cell-biology', label: 'Cell Biology' },
            { value: 'cancer-biology', label: 'Cancer Biology' },
            {
              value: 'biochemistry-chemical-biology',
              label: 'Biochemistry and Chemical Biology',
            },
          ]}
          value={selectedOptions}
        />
      </div>
    )
  }
}

SubjectAreaDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
}

export default SubjectAreaDropdown
