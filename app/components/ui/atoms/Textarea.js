import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui'

const Root = styled.div`
  display: flex;
  flex-direction: column;
  max-width: calc(${th('gridUnit')} * 14);
  margin-bottom: ${th('gridUnit')};
`

const Label = styled.label`
  font-size: ${th('fontSizeBaseSmall')};
  display: block;
`

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
  font-size: inherit;

  padding: calc(${th('gridUnit')} / 2);
  min-height: calc(${th('fontLineHeight')} * 2);

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
    const { label, value = '', name, readonly, ...props } = this.props
    return (
      <Root>
        {label && <Label htmlFor={this.inputId}>{label}</Label>}
        <Input
          id={this.inputId}
          name={name}
          readOnly={readonly}
          value={value}
          {...props}
        />
      </Root>
    )
  }
}

export default Textarea
