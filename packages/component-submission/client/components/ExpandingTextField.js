import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { th, override, validationColor } from '@pubsweet/ui-toolkit'

const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props =>
    props.inline ? '0' : `calc(${props.theme.gridUnit} * 3)`};
  ${override('ui.TextField')};
`

const Label = styled.label`
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('lineHeightBaseSmall')};
  display: block;
  ${override('ui.Label')};
  ${override('ui.TextField.Label')};
`

const TextArea = styled.textarea`
  border: ${th('borderWidth')} ${th('borderStyle')} ${validationColor};

  border-radius: ${th('borderRadius')};

  font-family: inherit;
  font-size: inherit;

  padding: ${th('gridUnit')};
  /* height: calc(${th('gridUnit')} * 6); */

  &::placeholder {
    color: ${th('colorTextPlaceholder')};
  }

  ${override('ui.TextField.Input')};
  height: auto;
  resize: none;
`

class ExpandingTextField extends React.Component {
  constructor(props) {
    super(props)
    this.inputId = `textfield-${Math.round(Math.random() * 1e12).toString(36)}`
    this.textAreaRef = React.createRef()

    this.state = { lines: props.minLines }
  }

  componentDidMount() {
    this.calculateHeight(this.props)
  }

  componentDidUpdate(prevProps) {
    this.calculateHeight(prevProps)
  }

  calculateHeight(prevProps) {
    const { lineHeight } = window.getComputedStyle(this.textAreaRef.current)
    const intLineHeight = parseInt(lineHeight, 10)
    const { scrollHeight, value } = this.textAreaRef.current
    const lines = Math.floor((scrollHeight - 24) / intLineHeight)

    const constrainedLines = Math.min(lines, this.props.maxRows || lines)

    if (prevProps.value.length > value.length) {
      // This will force container size to be re-evaluated when the amount of
      // text is reduced
      this.setLines(prevProps.minLines || 1)
    } else if (this.state.lines !== constrainedLines) {
      this.setLines(constrainedLines)
    }
  }

  setLines(lines = 1) {
    if (lines !== this.state.lines) {
      // Only trigger an update when it's changed
      this.setState({ lines })
    }
  }

  render() {
    const {
      className,
      label,
      type = 'text',
      value = '',
      readonly,
      inline,
      minLines,
      ...props
    } = this.props

    const { lines } = this.state

    return (
      <Root className={className} inline={inline}>
        {label && (
          <Label data-test-id="expanding-label" htmlFor={this.inputId}>
            {label}
          </Label>
        )}
        <TextArea
          id={this.inputId}
          readOnly={readonly}
          ref={this.textAreaRef}
          rows={lines || minLines}
          type={type}
          value={value}
          {...props}
        />
      </Root>
    )
  }
}

ExpandingTextField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  maxRows: PropTypes.number,
  minRows: PropTypes.number,
}

ExpandingTextField.defaultProps = {
  label: '',
  type: 'input',
  value: '',
  maxRows: 10,
  minRows: 1,
}

export default ExpandingTextField
