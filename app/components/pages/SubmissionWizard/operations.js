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
    clientStatus
    meta {
      title
      articleType
      subjects
    }
    formState
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
    opposedReviewers: assignees(role: "opposedReviewer") {
      ...ReviewerDetails
    }
    opposedReviewersReason
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

export const GET_MANUSCRIPT = gql`
  query GetManuscript($id: ID!) {
    manuscript(id: $id) {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`

export const CREATE_MANUSCRIPT = gql`
  mutation CreateManuscript {
    createManuscript {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`

export const UPDATE_MANUSCRIPT = gql`
  mutation UpdateManuscript($data: ManuscriptInput!) {
    updateManuscript(data: $data) {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`

export const SUBMIT_MANUSCRIPT = gql`
  mutation SubmitManuscript($data: ManuscriptInput!) {
    submitManuscript(data: $data) {
      ...WholeManuscript
    }
  }
  ${manuscriptFragment}
`
export const ON_UPLOAD_PROGRESS = gql`
  subscription {
    uploadProgress
  }
`
