import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import { Button } from '@pubsweet/ui'

import { CREATE_MANUSCRIPT } from '../graphql/mutations'

const NewSubmissionButton = ({ history, dataTestId, ...props }) => (
  <Mutation mutation={CREATE_MANUSCRIPT}>
    {createManuscript => (
      <Button
        data-test-id={dataTestId}
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

NewSubmissionButton.propTypes = {
  dataTestId: PropTypes.string.isRequired,
}

export default NewSubmissionButton
