import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { Flex, Box } from 'grid-styled'

const Label = styled.label`
  font-size: ${th('fontSizeBaseSmall')};
`

// TODO - remove when this function is added to pubsweet
const borderColor = ({ theme, validationStatus = 'default' }) =>
  ({
    error: theme.colorError,
    success: theme.colorSuccess,
    warning: theme.colorWarning,
    default: theme.colorBorder,
  }[validationStatus])

const Input = styled.textarea`
  border: ${th('borderWidth')} ${th('borderStyle')} ${borderColor};

  border-radius: ${th('borderRadius')};

  font-family: inherit;
  font-size: ${th('fontSizeBase')};
  line-height: ${th('fontLineHeightBase')};

  padding: ${th('space.2')};
  width: 100%;

  &::placeholder {
    color: ${th('colorTextPlaceholder')};
  }
`

class Textarea extends React.Component {
  componentWillMount() {
    // generate a unique ID to link the label to the input
    // note this may not play well with server rendering
    this.inputId = `textarea-${Math.round(Math.random() * 1e12).toString(36)}`
  }
  render() {
    const { label, readonly, value = '', ...props } = this.props
    return (
      <Flex flexDirection="column">
        <Box mb={1}>
          <Label htmlFor={this.inputId}>{label}</Label>
        </Box>
        <Box>
          <Input
            id={this.inputId}
            readOnly={readonly}
            value={value}
            {...props}
          />
        </Box>
      </Flex>
    )
  }
}

Textarea.propTypes = {
  label: PropTypes.string.isRequired,
}

export default Textarea
