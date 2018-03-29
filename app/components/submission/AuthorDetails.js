import React from 'react'
import styled from 'styled-components'

import { TextField } from '@pubsweet/ui'

const Row = styled.div`
  display: flex;
`

const Cell = styled.div`
  flex-grow: 1;
`

export default ({ values, handleChange }) => (
  <div>
    <Row>
      <Cell>
        <TextField
          name="firstName"
          onChange={handleChange}
          value={values.firstName}
        />
      </Cell>
      <Cell>
        <TextField
          name="lastName"
          onChange={handleChange}
          value={values.lastName}
        />
      </Cell>
    </Row>
    <Row>
      <Cell>
        <TextField name="email" onChange={handleChange} value={values.email} />
      </Cell>
      <Cell>
        <TextField
          name="institute"
          onChange={handleChange}
          value={values.institute}
        />
      </Cell>
    </Row>
  </div>
)
