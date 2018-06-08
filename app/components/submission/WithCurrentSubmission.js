import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'
import React from 'react'
import ErrorPage from '../global/ErrorPage'

const manuscriptFragment = gql`
  fragment WholeManuscript on Manuscript {
    id
    title
    manuscriptType
    subjectAreas
    suggestedSeniorEditors
    opposedSeniorEditors {
      name
      reason
    }
    suggestedReviewingEditors
    opposedReviewingEditors {
      name
      reason
    }
    suggestedReviewers {
      name
      email
    }
    opposedReviewers {
      name
      email
      reason
    }
    noConflictOfInterest
    files {
      name
      type
    }
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

const FINISH_SUBMISSION = gql`
  mutation FinishSubmission($data: ManuscriptInput!) {
    finishSubmission(data: $data) {
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
      return <ErrorPage error={error} />
    }

    function updateSubmission({ variables }) {
      return this.props.client.mutate({
        mutation: UPDATE_SUBMISSION,
        variables,
      })
    }

    function finishSubmission({ variables }) {
      return this.props.client.mutate({
        mutation: FINISH_SUBMISSION,
        variables,
      })
    }

    return this.props.children(initialValues, {
      updateSubmission: updateSubmission.bind(this),
      finishSubmission: finishSubmission.bind(this),
    })
  }
}

export default withApollo(WithCurrentSubmission)
