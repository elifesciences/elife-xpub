import React from 'react'
import PropTypes from 'prop-types'
import styled, { withTheme } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import Select, { createFilter, components } from 'react-select'

import Icon from '../../ui/atoms/Icon'

const SelectLimitMessage = styled.p`
  color: ${th('colorSuccess')};
`

const eLifeOptions = [
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
]

class SubjectAreaDropdown extends React.Component {
  constructor(props) {
    super(props)

    const savedOptions = this.props.savedValues.map(value =>
      eLifeOptions.find(option => option.value === value),
    )

    this.state = {
      selectedOptions: savedOptions,
      hasReachedMultiselectLimit: false,
    }

    const chooseBorderColorFromProps = (
      theme,
      validationStatus = 'default',
      isFocused,
    ) =>
      ({
        error: theme.colorError,
        success: theme.colorSuccess,
        warning: theme.colorWarning,
        default: isFocused ? '#2684FF' : theme.colorBorder,
      }[validationStatus])

    const gridUnitValue = parseInt(this.props.theme.gridUnit, 10)

    this.customReactSelectStyles = {
      valueContainer: (base, state) => ({
        ...base,
        padding: `${gridUnitValue / 2}px`, // combines with margin on multiValue to achieve gridUnit spacing around tags
      }),
      placeholder: (base, state) => ({
        ...base,
        color: this.props.theme.colorText,
        margin: `${gridUnitValue / 2}px`,
        padding: `${gridUnitValue / 2}px`,
      }),
      input: (base, state) => ({
        ...base,
        padding: `${gridUnitValue / 2}px`,
      }),
      multiValue: (base, state) => ({
        ...base,
        backgroundColor: this.props.theme.colorPrimary,
        color: this.props.theme.colorTextReverse,
        margin: `${gridUnitValue / 2}px`, // combines with padding on valueContainer to achieve gridUnit spacing around tags
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
          // overriding react-select's default hover behaviour - changing colours
          backgroundColor: this.props.theme.colorPrimary,
          color: this.props.theme.colorTextReverse,
        },
      }),
      menuList: (base, state) => ({
        ...base,
        padding: 0,
      }),
      menu: (base, { placement }) => ({
        ...base,
        borderRadius: `0 0 ${this.props.theme.borderRadius} ${
          this.props.theme.borderRadius
        }`,
        borderWidth: this.props.theme.borderWidth,
        marginBottom: 0,
        // leave room for the bottom border of the Control component to be visible on validation/focus
        marginTop: this.props.theme.borderWidth,
      }),
      option: (base, { isSelected, isFocused }) => ({
        ...base,
        backgroundColor:
          isSelected || isFocused
            ? this.props.theme.colorPrimary
            : 'transparent',
        color:
          isSelected || isFocused
            ? this.props.theme.colorTextReverse
            : this.props.theme.colorText,
        padding: `${gridUnitValue * 2}px`,
      }),
      control: (base, { isFocused }) => ({
        ...base,
        borderRadius: this.props.theme.borderRadius,
        borderWidth: this.props.theme.borderWidth,
        borderStyle: this.props.theme.borderStyle,
        borderColor: chooseBorderColorFromProps(
          this.props.theme,
          this.props.validationStatus,
          isFocused,
        ),
        // overrides the fact that react-select changes borderColor on hover
        '&:hover': {
          borderColor: chooseBorderColorFromProps(
            this.props.theme,
            this.props.validationStatus,
            isFocused,
          ),
        },
        backgroundColor: this.props.theme.backgroundColor,
        minHeight: this.props.gridUnit,
      }),
    }
  }

  // https://github.com/JedWatson/react-select/blob/v2/src/Select.js
  // react-select exposes onChange: (ValueType, ActionMeta) => void
  handleChange = selectedOptions => {
    if (selectedOptions.length <= 2) {
      this.setState({ selectedOptions, hasReachedMultiselectLimit: false })
      this.props.onChange(selectedOptions)
    }
    if (selectedOptions.length >= 2) {
      this.setState({ hasReachedMultiselectLimit: true })
    }
  }

  render() {
    const { selectedOptions, hasReachedMultiselectLimit } = this.state
    const { label, name, onBlur, theme } = this.props

    const TagRemovalIcon = props => (
      <components.MultiValueRemove {...props}>
        {/* Icon requires a size, but width and height are more accurate and applied in styling below */}
        <Icon size={3} {...props} theme={theme}>
          Cross
        </Icon>
      </components.MultiValueRemove>
    )

    const StyledTagRemovalIcon = styled(TagRemovalIcon)`
      svg {
        stroke: ${theme.colorTextReverse};
        fill: ${theme.colorTextReverse};
        padding: 0;
        width: 20px;
        height: 20px;
      }
    `

    const selectChildProps = {
      components: {
        ClearIndicator: null,
        IndicatorSeparator: null,
        MultiValueRemove: StyledTagRemovalIcon,
      },
      inputId: 'subject-area-select',
      isMulti: true,
      name,
      onBlur,
      onChange: this.handleChange,
      options: eLifeOptions,
      styles: this.customReactSelectStyles,
      value: selectedOptions,
      filterOption: createFilter({
        matchFrom: 'start',
      }),
    }

    return (
      <React.Fragment>
        {/* htmlFor matches with react-select's inputId, which applies the correct id to the internal sub-component */}
        {/* eslint-disable-next-line jsx-a11y/label-has-for */}
        <label htmlFor="subject-area-select">{label}</label>
        {!hasReachedMultiselectLimit && <Select {...selectChildProps} />}
        {hasReachedMultiselectLimit && (
          <div>
            <Select
              {...selectChildProps}
              components={{
                ...selectChildProps.components,
                DropdownIndicator: null,
              }}
              isSearchable={false}
              menuIsOpen={false}
            />
            <SelectLimitMessage>
              No more than two subject areas
            </SelectLimitMessage>
          </div>
        )}
      </React.Fragment>
    )
  }
}

SubjectAreaDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  savedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default withTheme(SubjectAreaDropdown)
