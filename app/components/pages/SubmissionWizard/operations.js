import gql from 'graphql-tag'

const editorFragment = gql`
  fragment EditorDetails on EditorUser {
    id
    name
    institution
  }
`

const manuscriptFragment = gql`
  fragment WholeManuscript on Manuscript {
    id
    title
    manuscriptType
    subjectAreas
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
      stage
      discussion
      previousArticle
      cosubmission {
        title
      }
    }
    manuscriptPersons {
      role
      metadata {
        ... on AuthorMetadata {
          confirmed
        }
      }
    }
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
