import React from 'react'
import styled from 'styled-components'

import { TextField, Button, Heading } from '@pubsweet/ui'

const Row = styled.div`
  display: flex;
`

const Cell = styled.div`
  flex-grow: 1;
`

class AuthorDetails extends React.Component {
  constructor() {
    super()

    this.openAssigneeForm = this.openAssigneeForm.bind(this)
    this.closeAssigneeForm = this.closeAssigneeForm.bind(this)

    this.state = {
      assigneeFormOpen: false,
    }
  }

  openAssigneeForm() {
    this.setState({ assigneeFormOpen: true })
  }

  closeAssigneeForm() {
    this.props.setFieldValue('assignee', {})
    this.setState({ assigneeFormOpen: false })
  }

  render() {
    const { values, handleChange } = this.props
    const { assigneeFormOpen } = this.state

    return (
      <div>
        <Row>
          <Cell>
            <TextField
              label="First name"
              name="firstName"
              onChange={handleChange}
              value={values.firstName}
            />
          </Cell>
          <Cell>
            <TextField
              label="Last name"
              name="lastName"
              onChange={handleChange}
              value={values.lastName}
            />
          </Cell>
        </Row>
        <Row>
          <Cell>
            <TextField
              label="Email (correspondence)"
              name="email"
              onChange={handleChange}
              value={values.email}
            />
          </Cell>
          <Cell>
            <TextField
              label="Institute"
              name="institute"
              onChange={handleChange}
              value={values.institute}
            />
          </Cell>
        </Row>

        {assigneeFormOpen ? (
          <AssigneeForm
            handleChange={handleChange}
            handleClose={this.closeAssigneeForm}
            values={values.assignee}
          />
        ) : (
          <Button onClick={this.openAssigneeForm}>
            Assign a colleague to handle this submission
          </Button>
        )}
      </div>
    )
  }
}

const AssigneeForm = ({ values, handleChange, handleClose }) => (
  <div>
    <Heading level={6}>Assignee for correspondence</Heading>

    <Row>
      <Cell>
        <TextField
          label="First name"
          name="assignee.firstName"
          onChange={handleChange}
          value={values.firstName}
        />
      </Cell>
      <Cell>
        <TextField
          label="Last name"
          name="assignee.lastName"
          onChange={handleChange}
          value={values.lastName}
        />
      </Cell>
    </Row>

    <Row>
      <Cell>
        <TextField
          label="Email"
          name="assignee.email"
          onChange={handleChange}
          value={values.email}
        />
      </Cell>
      <Cell>
        <Button onClick={handleClose}>Remove assignment</Button>
      </Cell>
    </Row>
  </div>
)

export default AuthorDetails
