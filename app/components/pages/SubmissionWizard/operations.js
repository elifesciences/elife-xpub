import gql from 'graphql-tag'

const editorFragment = gql`
  fragment EditorDetails on EditorUser {
    id
    name
    aff
    subjectAreas
  }
`

const manuscriptFragment = gql`
  fragment WholeManuscript on Manuscript {
    id
    status
    meta {
      title
      articleType
      subjects
    }
    suggestedSeniorEditors {
      ...EditorDetails
    }
    opposedSeniorEditors {
      ...EditorDetails
    }
    opposedSeniorEditorsReason
    suggestedReviewingEditors {
      ...EditorDetails
    }
    opposedReviewingEditors {
      ...EditorDetails
    }
    opposedReviewingEditorsReason
    suggestedReviewers {
      name
      email
    }
    opposedReviewers {
      name
      email
      reason
    }
    suggestionsConflict
    files {
      filename
      type
    }
    coverLetter
    author {
      firstName
      lastName
      email
      aff
    }
    previouslyDiscussed
    previouslySubmitted
    cosubmission
  }
  ${editorFragment}
`

export const GET_CURRENT_SUBMISSION = gql`
  query CurrentSubmission {
    currentSubmission {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`

export const CREATE_SUBMISSION = gql`
  mutation CreateSubmission {
    createSubmission {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`

export const UPDATE_SUBMISSION = gql`
  mutation UpdateSubmission($data: ManuscriptInput!, $isAutoSave: Boolean) {
    updateSubmission(data: $data, isAutoSave: $isAutoSave) {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`

export const FINISH_SUBMISSION = gql`
  mutation FinishSubmission($data: ManuscriptInput!) {
    finishSubmission(data: $data) {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`
