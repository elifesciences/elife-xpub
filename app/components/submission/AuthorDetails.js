import React from 'react'
import { Flex, Box } from 'grid-styled'

import { Button, Heading } from '@pubsweet/ui'
import ValidatedField from '../ui/atoms/ValidatedField'

import { emptyAssignee } from './AuthorDetailsSchema'

class AuthorDetails extends React.Component {
  constructor() {
    super()

    this.openAssigneeForm = this.openAssigneeForm.bind(this)
    this.closeAssigneeForm = this.closeAssigneeForm.bind(this)
  }

  openAssigneeForm() {
    this.props.setFieldValue('assignee', emptyAssignee)
  }

  closeAssigneeForm() {
    this.props.setFieldValue('assignee', null)
    this.props.setFieldTouched('assignee', false)
  }

  render() {
    const { handleSubmit, values } = this.props

    return (
      <form onSubmit={handleSubmit}>
        <Flex>
          <Box width={1 / 2}>
            <ValidatedField label="First name" name="firstName" />
          </Box>
          <Box width={1 / 2}>
            <ValidatedField label="Last name" name="lastName" />
          </Box>
        </Flex>
        <Flex>
          <Box width={1 / 2}>
            <ValidatedField label="Email (correspondence)" name="email" />
          </Box>
          <Box width={1 / 2}>
            <ValidatedField label="Institute" name="institute" />
          </Box>
        </Flex>

        <Flex>
          <Box width={1}>
            {values.assignee ? (
              <AssigneeForm handleClose={this.closeAssigneeForm} />
            ) : (
              <Button onClick={this.openAssigneeForm}>
                Assign a colleague to handle this submission
              </Button>
            )}
          </Box>
        </Flex>

        <Flex>
          <Box width={1}>
            <Button primary type="submit">
              Next
            </Button>
          </Box>
        </Flex>
      </form>
    )
  }
}

const AssigneeForm = ({ handleClose }) => (
  <div>
    <Heading level={3}>Assignee for correspondence</Heading>

    <Flex>
      <Box width={1 / 2}>
        <ValidatedField label="First name" name="assignee.firstName" />
      </Box>
      <Box width={1 / 2}>
        <ValidatedField label="Last name" name="assignee.lastName" />
      </Box>
    </Flex>

    <Flex>
      <Box width={1 / 2}>
        <ValidatedField label="Email" name="assignee.email" />
      </Box>
      <Box width={1 / 2}>
        <Button onClick={handleClose}>Remove assignment</Button>
      </Box>
    </Flex>
  </div>
)

export default AuthorDetails
