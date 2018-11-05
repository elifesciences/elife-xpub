import React from 'react'
import { Mutation } from 'react-apollo'
import { Button } from '@pubsweet/ui'

import { CREATE_MANUSCRIPT } from '../SubmissionWizard/operations'

const NewSubmissionButton = ({ history, ...props }) => (
  <Mutation mutation={CREATE_MANUSCRIPT}>
    {createManuscript => (
      <Button
        data-test-id="mobile-new-submission"
        onClick={() =>
          createManuscript().then(result =>
            history.push(`/submit/${result.data.createManuscript.id}/author`),
          )
        }
        primary
        {...props}
      >
        New Submission
      </Button>
    )}
  </Mutation>
)

export default NewSubmissionButton
