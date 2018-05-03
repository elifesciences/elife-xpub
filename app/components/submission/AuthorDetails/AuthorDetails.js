import React from 'react'
import { Flex, Box } from 'grid-styled'

import { Button, Heading, H1, Checkbox } from '@pubsweet/ui'

import ValidatedField from '../../ui/atoms/ValidatedField'

import { emptyPerson } from './AuthorDetailsSchema'

import ProgressBar from '../ProgressBar'

class AuthorDetails extends React.Component {
  constructor(props) {
    super()
    this.openCorrespondentForm = this.openCorrespondentForm.bind(this)
    this.closeCorrespondentForm = this.closeCorrespondentForm.bind(this)
    this.handleNotCorrespondingAuthor = this.handleNotCorrespondingAuthor.bind(
      this,
    )
  }

  get correspondentIsAssigned() {
    return this.props.values.submissionMeta.hasCorrespondent
  }

  openCorrespondentForm() {
    this.props.setFieldValue('submissionMeta.hasCorrespondent', true)
  }
  closeCorrespondentForm() {
    this.props.setFieldValue('submissionMeta.correspondent', emptyPerson)
    this.props.setFieldValue('submissionMeta.hasCorrespondent', false)
    this.props.setFieldTouched('submissionMeta.correspondent', false)
  }

  handleNotCorrespondingAuthor() {
    if (!this.correspondentIsAssigned) {
      this.openCorrespondentForm()
    } else {
      this.closeCorrespondentForm()
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
            <ValidatedField
              label="First name"
              name="submissionMeta.author.firstName"
            />
          </Box>
          <Box width={1 / 2}>
            <ValidatedField
              label="Last name"
              name="submissionMeta.author.lastName"
            />
          </Box>
        </Flex>
        <Flex>
          <Box width={1 / 2}>
            <ValidatedField
              label="Email (correspondence)"
              name="submissionMeta.author.email"
              type="email"
            />
          </Box>
          <Box width={1 / 2}>
            <ValidatedField
              label="Institution"
              name="submissionMeta.author.institution"
            />
          </Box>
        </Flex>

        <Flex>
          <Box width={1}>
            <Checkbox
              checked={this.correspondentIsAssigned}
              label="I am not the corresponding author"
              name="cbNotCorrespondingAuthor"
              onChange={this.handleNotCorrespondingAuthor}
            />
          </Box>
        </Flex>

        {this.correspondentIsAssigned && (
          <Flex>
            <Box width={1}>
              <CorrespondentForm />
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

const CorrespondentForm = ({ handleClose }) => (
  <Box p={3} width={1}>
    <Heading level={3}>Assignee for correspondence</Heading>
    <Flex>
      <Box width={1 / 2}>
        <ValidatedField
          label="First name"
          name="submissionMeta.correspondent.firstName"
        />
      </Box>
      <Box width={1 / 2}>
        <ValidatedField
          label="Last name"
          name="submissionMeta.correspondent.lastName"
        />
      </Box>
    </Flex>

    <Flex>
      <Box width={1 / 2}>
        <ValidatedField
          label="Email"
          name="submissionMeta.correspondent.email"
          type="email"
        />
      </Box>
      <Box width={1 / 2}>
        <ValidatedField
          label="Institution"
          name="submissionMeta.correspondent.institution"
        />
      </Box>
    </Flex>
  </Box>
)

export default AuthorDetails
