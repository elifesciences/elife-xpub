import React from 'react'
import { Flex, Box } from 'grid-styled'

import { Button, Heading, H1, Checkbox } from '@pubsweet/ui'

import ValidatedField from '../../ui/atoms/ValidatedField'

<<<<<<< HEAD:app/components/submission/AuthorDetails/AuthorDetails.js
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
    // On page load the assignee is undefined, if it is unassigned it
    // becomes null, see closeAssigneeForm(). Hence the truthy comparison.
    return this.props.values.assignee != null
=======
import { emptyPerson } from './AuthorDetailsSchema'

class AuthorDetails extends React.Component {
  constructor(props) {
    super(props.initialValues)
    console.log(this.props)
    this.openCorrespondentForm = this.openCorrespondentForm.bind(this)
    this.closeCorrespondentForm = this.closeCorrespondentForm.bind(this)
>>>>>>> feat(submission): add more progress to storing state on frontend submission:app/components/submission/AuthorDetails.js
  }
  openCorrespondentForm() {
    this.props.setFieldValue('displayCorrespondent', true)
  }
  closeCorrespondentForm() {
    this.props.setFieldValue('correspondent', emptyPerson)
    this.props.setFieldValue('displayCorrespondent', false)
    this.props.setFieldTouched('correspondent', false)
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

    /* function tst(event) { */
    /*     console.log("next was clicked"); */
    /*     //console.log(values); */
    /*     console.log(arguments); */
    /*     event.preventDefault(); */
    /* } */

    return (
      /* <form noValidate onSubmit={tst}> */
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
<<<<<<< HEAD:app/components/submission/AuthorDetails/AuthorDetails.js
            <ValidatedField label="Institution" name="institution" />
=======
            <ValidatedField
              label="Institution"
              name="submissionMeta.author.institution"
            />
>>>>>>> feat(submission): add more progress to storing state on frontend submission:app/components/submission/AuthorDetails.js
          </Box>
        </Flex>

        <Flex>
          <Box width={1}>
<<<<<<< HEAD:app/components/submission/AuthorDetails/AuthorDetails.js
            <Checkbox
              checked={this.isAssigned}
              label="I am not the corresponding author"
              name="cbNotCorrespondingAuthor"
              onChange={this.handleNotCorrespondingAuthor}
            />
=======
            {values.submissionMeta.displayCorrespondent ? (
              <CorrespondentForm handleClose={this.closeCorrespondentForm} />
            ) : (
              <Button onClick={this.openCorrespondentForm}>
                Assign a colleague to handle this submission
              </Button>
            )}
>>>>>>> feat(submission): add more progress to storing state on frontend submission:app/components/submission/AuthorDetails.js
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

<<<<<<< HEAD:app/components/submission/AuthorDetails/AuthorDetails.js
const AssigneeForm = ({ handleClose }) => (
  <Box p={3} width={1}>
=======
const CorrespondentForm = ({ handleClose }) => (
  <React.Fragment>
>>>>>>> feat(submission): add more progress to storing state on frontend submission:app/components/submission/AuthorDetails.js
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
        />
      </Box>
      <Box width={1 / 2}>
        <ValidatedField label="Institution" name="assignee.institution" />
      </Box>
    </Flex>
  </Box>
)

export default AuthorDetails
