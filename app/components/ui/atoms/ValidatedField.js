import React from 'react'
import styled from 'styled-components'
import { Field } from 'formik'
import { get } from 'lodash'
import { TextField, th } from '@pubsweet/ui'

const ErrorMessage = styled.div`
  display: block;
  margin-top: calc(${th('gridUnit')} * -1);
  color: ${th('colorError')};
`

export default ({ name, component: FieldComponent = TextField, ...props }) => {
  const render = ({ field, form }) => {
    const touched = get(form.touched, name)
    const errors = get(form.errors, name)

    let validationStatus
    if (touched) validationStatus = 'success'
    if (touched && errors) validationStatus = 'error'

    return (
      <div>
        <FieldComponent
          validationStatus={validationStatus}
          {...field}
          {...props}
        />
        {touched && errors && <ErrorMessage>{errors}</ErrorMessage>}
      </div>
    )
  }

  return <Field name={name} render={render} />
}
