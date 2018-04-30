import React from 'react'
import { Flex, Box } from 'grid-styled'

import { Button, Heading, H1, Checkbox } from '@pubsweet/ui'

import ValidatedField from '../../ui/atoms/ValidatedField'

import { emptyAssignee } from './AuthorDetailsSchema'
import ProgressBar from '../ProgressBar'

class AuthorDetails extends React.Component {
  constructor() {
    super()

    this.openAssigneeForm = this.openAssigneeForm.bind(this)
    this.closeAssigneeForm = this.closeAssigneeForm.bind(this)
    this.handleNotCorrespondingAuthor = this.handleNotCorrespondingAuthor.bind(
      this,
    )
  }

  get isAssigned() {
    return this.props.values.assignee !== null
  }

  openAssigneeForm() {
    this.props.setFieldValue('assignee', emptyAssignee)
  }

  closeAssigneeForm() {
    this.props.setFieldValue('assignee', null)
    this.props.setFieldTouched('assignee', false)
  }

  handleNotCorrespondingAuthor() {
    if (!this.isAssigned) {
      this.openAssigneeForm()
    } else {
      this.closeAssigneeForm()
    }
  }

  render() {
    const { handleSubmit } = this.props

    return (
      <form noValidate onSubmit={handleSubmit}>
        <ProgressBar currentStep={0} />

        <H1>Are you handling this submission?</H1>

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
            <ValidatedField
              label="Email (correspondence)"
              name="email"
              type="email"
            />
          </Box>
          <Box width={1 / 2}>
            <ValidatedField label="Institution" name="institution" />
          </Box>
        </Flex>

        <Flex>
          <Box width={1}>
            <Checkbox
              checked={this.isAssigned}
              label="I am not the corresponding author"
              name="cbNotCorrespondingAuthor"
              onChange={this.handleNotCorrespondingAuthor}
            />
          </Box>
        </Flex>

        {this.isAssigned && (
          <Flex>
            <Box width={1}>
              <AssigneeForm />
            </Box>
          </Flex>
        )}

        <Flex>
          <Box width={1}>
            <Button data-test-id="next" primary type="submit">
              Next
            </Button>
          </Box>
        </Flex>
      </form>
    )
  }
}

const AssigneeForm = ({ handleClose }) => (
  <Box p={3} width={1}>
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
        <ValidatedField label="Institution" name="institution" />
      </Box>
    </Flex>
  </Box>
)

export default AuthorDetails
