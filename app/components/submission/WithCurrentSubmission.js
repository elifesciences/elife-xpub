import gql from 'graphql-tag'
import { withApollo, Mutation } from 'react-apollo'
import React from 'react'

const manuscriptFragment = gql`
  fragment WholeManuscript on Manuscript {
    id
    title
    source
    manuscriptType
    submissionMeta {
      coverLetter
      author {
        firstName
        lastName
        email
        institution
      }
      hasCorrespondent
      correspondent {
        firstName
        lastName
        email
        institution
      }
      stage
      discussedPreviously
      discussion
      consideredPreviously
      previousArticle
      cosubmission
      cosubmissionTitle
      cosubmissionId
    }
  }
`

export const GET_CURRENT_SUBMISSION = gql`
  query CurrentSubmission {
    currentSubmission {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`

const CREATE_SUBMISSION = gql`
  mutation CreateSubmission {
    createSubmission {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`

const UPDATE_SUBMISSION = gql`
  mutation UpdateSubmission($data: ManuscriptInput!) {
    updateSubmission(data: $data) {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`

class WithCurrentSubmission extends React.Component {
  constructor() {
    super()
    this.state = { error: null, data: null, loading: true }
  }
  componentDidMount() {
    this.props.client
      .query({ query: GET_CURRENT_SUBMISSION })
      .then(({ data }) => {
        if (data.currentSubmission) {
          return this.setState({ data, error: null, loading: false })
        }
        return this.props.client
          .mutate({
            mutation: CREATE_SUBMISSION,
            refetchQueries: [
              {
                query: GET_CURRENT_SUBMISSION,
              },
            ],
          })
          .then(({ data: createData }) => {
            this.setState({
              data: createData,
              error: undefined,
              loading: false,
            })
          })
      })
      .catch(error => this.setState({ error, data: null, loading: false }))
  }
  render() {
    const { loading, error, data } = this.state

    const initialValues =
      data && (data.currentSubmission || data.createSubmission)

    if (loading) {
      return <div>Loading...</div>
    }

    if (error) {
      return <div>{error.message}</div>
    }

    return (
      <Mutation mutation={UPDATE_SUBMISSION}>
        {updateSubmission =>
          this.props.children(updateSubmission, initialValues)
        }
      </Mutation>
    )
  }
}

export default withApollo(WithCurrentSubmission)
