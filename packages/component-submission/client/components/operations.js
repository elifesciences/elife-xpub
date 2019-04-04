import gql from 'graphql-tag'

const editorFragment = gql`
  fragment EditorDetails on EditorAlias {
    id
    name
    aff
    focuses
    expertises
  }
`
const reviewerFragment = gql`
  fragment ReviewerDetails on ReviewerAlias {
    name
    email
  }
`

export const manuscriptFragment = gql`
  fragment WholeManuscript on Manuscript {
    id
    clientStatus
    meta {
      title
      articleType
      subjects
    }
    lastStepVisited
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
    files {
      downloadLink
      filename
      type
      status
      id
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
    fileStatus
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
  subscription onManuscriptUpload($id: ID!) {
    manuscriptUploadProgress(id: $id)
  }
`
