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
  state = { error: null, data: null, loading: true }

  componentDidMount() {
    this.querySubscription = this.props.client
      .watchQuery({ query: GET_CURRENT_SUBMISSION })
      .subscribe(
        ({ data }) => {
          if (data.currentSubmission) {
            this.setData(data)
          } else {
            this.props.client
              .mutate({
                mutation: CREATE_SUBMISSION,
                refetchQueries: [{ query: GET_CURRENT_SUBMISSION }],
              })
              .then(result => this.setData(result.data))
              .catch(error => this.setError(error))
          }
        },
        error => this.setError(error),
      )
  }

  setData(data) {
    this.setState({ data, error: undefined, loading: false })
  }

  setError(error) {
    this.setState({ data: null, error, loading: false })
  }

  componentWillUnmount() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe()
      delete this.querySubscription
    }
  }

  render() {
    const { loading, error, data } = this.state

    if (loading) {
      return <div>Loading...</div>
    }

    if (error) {
      return <ErrorPage error={error} />
    }

    const initialValues =
      data && (data.currentSubmission || data.createSubmission)

    return this.props.children(initialValues, {
      updateSubmission: ({ variables }) =>
        this.props.client.mutate({
          mutation: UPDATE_SUBMISSION,
          variables,
        }),
      finishSubmission: ({ variables }) =>
        this.props.client.mutate({
          mutation: FINISH_SUBMISSION,
          variables,
        }),
    })
  }
}

export default withApollo(WithCurrentSubmission)
