import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import React from 'react'

export const GET_CURRENT_SUBMISSION = gql`
  query CurrentSubmission {
    currentSubmission {
      id
      title
      source
      submissionMeta {
        author {
          firstName
          lastName
          email
          institution
        }
      }
    }
  }
`

const CREATE_SUBMISSION = gql`
  mutation CreateSubmission {
    createSubmission {
      id
      title
      source
      submissionMeta {
        author {
          firstName
          lastName
          email
          institution
        }
      }
    }
  }
`

/**
 * TODO update submission
 * "id": "9e7920ba-ea8b-4ccc-9668-45c80da51947"
 */

class CreateSubmissionWrapper extends React.Component {
  componentDidMount() {
    this.props.createSubmission()
  }
  render() {
    return this.props.children(this.props.data)
  }
}

const WithCurrentSubmission = ({ children }) => (
  <Query query={GET_CURRENT_SUBMISSION}>
    {({ loading, error, data }) => {
      if (loading) return <div>Loading...</div>

      if (error) {
        return <div>{error.message}</div>
      }

      if (!data.currentSubmission.id) {
        return (
          <Mutation mutation={CREATE_SUBMISSION}>
            {(createSubmission, mutationData) => (
              <CreateSubmissionWrapper
                createSubmission={createSubmission}
                data={mutationData}
              >
                {children}
              </CreateSubmissionWrapper>
            )}
          </Mutation>
        )
        // create submission
      }
      return children(data)
    }}
  </Query>
)

export default WithCurrentSubmission
