import React from 'react'
import PropTypes from 'prop-types'
import styled, { withTheme } from 'styled-components'
import { th } from '@pubsweet/ui'
import Select from 'react-select'

const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${th('gridUnit')};
`

const SelectLimitMessage = styled.p`
  color: ${th('colorSuccess')};
`

export class ThemelessSubjectAreaDropdown extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOptions: [],
      hasReachedMultiselectLimit: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)

    this.customReactSelectStyles = {
      multiValue: (base, state) => ({
        ...base,
        backgroundColor: this.props.theme.colorPrimary,
      }),
    }
  }

  // https://github.com/JedWatson/react-select/blob/v2/src/Select.js
  // react-select exposes onChange: (ValueType, ActionMeta) => void
  handleChange = selectedOptions => {
    if (selectedOptions.length <= 2) {
      this.setState({ selectedOptions, hasReachedMultiselectLimit: false })
      if (this.props.onChange) this.props.onChange(selectedOptions)
    }
    if (selectedOptions.length >= 2) {
      this.setState({ hasReachedMultiselectLimit: true })
    }
  }

  handleBlur = e => {
    if (this.props.onBlur) this.props.onBlur(e)
  }

  render() {
    const { selectedOptions, hasReachedMultiselectLimit } = this.state
    const { label, name } = this.props

    const selectChildProps = {
      components: { ClearIndicator: null },
      inputId: 'subject-area-select',
      isMulti: true,
      name,
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      options: [
        {
          value: 'biochemistry-chemical-biology',
          label: 'Biochemistry and Chemical Biology',
        },
        { value: 'cancer-biology', label: 'Cancer Biology' },
        { value: 'cell-biology', label: 'Cell Biology' },
        {
          value: 'chromosomes-gene-expression',
          label: 'Chromosomes and Gene Expression',
        },
        {
          value: 'computational-systems-biology',
          label: 'Computational and Systems Biology',
        },
        {
          value: 'developmental-biology-stem-cells',
          label: 'Developmental Biology and Stem Cells',
        },
        { value: 'ecology', label: 'Ecology' },
        {
          value: 'epidemiology-global-health',
          label: 'Epidemiology and Global Health',
        },
        { value: 'evolutionary-biology', label: 'Evolutionary Biology' },
        { value: 'genetics-genomics', label: 'Genetics and Genomics' },
        {
          value: 'human-biology-medicine',
          label: 'Human Biology and Medicine',
        },
        {
          value: 'immunology-inflammation',
          label: 'Immunology and Inflammation',
        },
        {
          value: 'microbiology-infectious-disease',
          label: 'Microbiology and Infectious Disease',
        },
        { value: 'neuroscience', label: 'Neuroscience' },
        { value: 'physics-living-systems', label: 'Physics of Living Systems' },
        { value: 'plant-biology', label: 'Plant Biology' },
        {
          value: 'structural-biology-molecular-biophysics',
          label: 'Structural Biology and Molecular Biophysics',
        },
      ],
      styles: this.customReactSelectStyles,
      value: selectedOptions,
      filterOption: (option, rawInput) => {
        const input = rawInput.replace(/^\s+|\s+$/g, '').toLowerCase()
        const candidate = `${option.label} ${option.value}`
          .replace(/^\s+|\s+$/g, '')
          .toLowerCase()

        return candidate.substr(0, input.length) === input
      },
    }

    return (
      <Root>
        {/* htmlFor matches with react-select's inputId, which applies the correct id to the internal sub-component */}
        {/* eslint-disable-next-line jsx-a11y/label-has-for */}
        <label htmlFor="subject-area-select">{label}</label>
        {!hasReachedMultiselectLimit && <Select {...selectChildProps} />}
        {hasReachedMultiselectLimit && (
          <div>
            <Select
              {...selectChildProps}
              components={{ ClearIndicator: null, DropdownIndicator: null }}
              isSearchable={false}
              menuIsOpen={false}
            />
            <SelectLimitMessage>
              No more than two subject areas
            </SelectLimitMessage>
          </div>
        )}
      </Root>
    )
  }
}

const SubjectAreaDropdown = withTheme(ThemelessSubjectAreaDropdown)

SubjectAreaDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
}

export default SubjectAreaDropdown
