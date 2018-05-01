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
        coverLetter
        author {
          firstName
          lastName
          email
          institution
        }
        displayCorrespondent
        correspondent {
          firstName
          lastName
          email
          institution
        }
        stage
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
        coverLetter
        author {
          firstName
          lastName
          email
          institution
        }
        displayCorrespondent
        correspondent {
          firstName
          lastName
          email
          institution
        }
        stage
      }
    }
  }
`

const UPDATE_SUBMISSION = gql`
  mutation UpdateSubmission($data: ManuscriptInput!) {
    updateSubmission(data: $data) {
      id
      title
      submissionMeta {
        author {
          firstName
          lastName
          email
          institution
        }
        displayCorrespondent
        correspondent {
          firstName
          lastName
          email
          institution
        }
      }
    }
  }
`

class CreateSubmissionWrapper extends React.Component {
  componentDidMount() {
    this.props.createSubmission()
  }
  render() {
    const { createResult } = this.props
    const { loading, error } = createResult

    if (loading) {
      return <div>Loading...</div>
    }
    if (error) {
      return <div>{error.message}</div>
    }

    return (
      <Mutation mutation={UPDATE_SUBMISSION}>
        {(updateSubmission, updateResult) =>
          this.props.children(updateSubmission, updateResult, createResult)
        }
      </Mutation>
    )
  }
}

const WithCurrentSubmission = ({ children }) => (
  <Query query={GET_CURRENT_SUBMISSION}>
    {getResult => {
      const { loading, error, data } = getResult

      if (loading) {
        return <div>Loading...</div>
      }

      if (error) {
        return <div>{error.message}</div>
      }

      if (!data.currentSubmission) {
        return (
          <Mutation mutation={CREATE_SUBMISSION}>
            {(createSubmission, mutationResult) => (
              <CreateSubmissionWrapper
                createResult={mutationResult}
                createSubmission={createSubmission}
              >
                {children}
              </CreateSubmissionWrapper>
            )}
          </Mutation>
        )
      }
      return (
        <Mutation mutation={UPDATE_SUBMISSION}>
          {(updateSubmission, updateResult) =>
            children(updateSubmission, updateResult, getResult)
          }
        </Mutation>
      )
    }}
  </Query>
)

export default WithCurrentSubmission
