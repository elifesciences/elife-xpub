import gql from 'graphql-tag'

export const ON_UPLOAD_PROGRESS = gql`
  subscription onManuscriptUpload($id: ID!) {
    manuscriptUploadProgress(id: $id)
  }
`
