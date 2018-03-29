import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from 'grid-styled'

import { TextField, Button, Heading } from '@pubsweet/ui'

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
        <Flex>
          <Box width={1 / 2}>
            <TextField
              label="First name"
              name="firstName"
              onChange={handleChange}
              value={values.firstName}
            />
          </Box>
          <Box width={1 / 2}>
            <TextField
              label="Last name"
              name="lastName"
              onChange={handleChange}
              value={values.lastName}
            />
          </Box>
        </Flex>
        <Flex>
          <Box width={1 / 2}>
            <TextField
              label="Email (correspondence)"
              name="email"
              onChange={handleChange}
              value={values.email}
            />
          </Box>
          <Box width={1 / 2}>
            <TextField
              label="Institute"
              name="institute"
              onChange={handleChange}
              value={values.institute}
            />
          </Box>
        </Flex>

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

    <Flex>
      <Box width={1 / 2}>
        <TextField
          label="First name"
          name="assignee.firstName"
          onChange={handleChange}
          value={values.firstName}
        />
      </Box>
      <Box width={1 / 2}>
        <TextField
          label="Last name"
          name="assignee.lastName"
          onChange={handleChange}
          value={values.lastName}
        />
      </Box>
    </Flex>

    <Flex>
      <Box width={1 / 2}>
        <TextField
          label="Email"
          name="assignee.email"
          onChange={handleChange}
          value={values.email}
        />
      </Box>
      <Box width={1 / 2}>
        <Button onClick={handleClose}>Remove assignment</Button>
      </Box>
    </Flex>
  </div>
)

export default AuthorDetails
