import gql from 'graphql-tag'

const editorFragment = gql`
  fragment EditorDetails on EditorAlias {
    id
    name
    aff
    subjectAreas
  }
`
const reviewerFragment = gql`
  fragment ReviewerDetails on ReviewerAlias {
    name
    email
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
    suggestedSeniorEditors: assignees(role: "suggestedSeniorEditor") {
      ...EditorDetails
    }
    opposedSeniorEditors: assignees(role: "opposedSeniorEditor") {
      ...EditorDetails
    }
    opposedSeniorEditorsReason
    suggestedReviewingEditors: assignees(role: "suggestedReviewingEditor") {
      ...EditorDetails
    }
    opposedReviewingEditors: assignees(role: "opposedReviewingEditor") {
      ...EditorDetails
    }
    opposedReviewingEditorsReason
    suggestedReviewers: assignees(role: "suggestedReviewer") {
      ...ReviewerDetails
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
    submitterSignature
    disclosureConsent
  }
  ${editorFragment}
  ${reviewerFragment}
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
