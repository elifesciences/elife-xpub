import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { Box } from '@rebass/grid'

const Label = styled.label`
  font-size: ${th('fontSizeBaseSmall')};
`

const Input = styled.textarea`
  border: ${th('borderWidth')} ${th('borderStyle')}
    ${({ validationStatus }) =>
      validationStatus === 'error' ? th('colorError') : th('colorBorder')};

  border-radius: ${th('borderRadius')};

  font-family: inherit;
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};

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
    // Note: readonly is explicitly passed in because JSX readOnly has an uppercase 'O', so destructuring props is not enough
    const { label, readonly, ...props } = this.props
    return (
      <React.Fragment>
        <Box mb={1}>
          <Label htmlFor={this.inputId}>{label}</Label>
        </Box>
        <Input id={this.inputId} readOnly={readonly} {...props} />
      </React.Fragment>
    )
  }
}

Textarea.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default Textarea
