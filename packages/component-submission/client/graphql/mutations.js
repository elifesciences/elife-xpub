import gql from 'graphql-tag'

import { manuscriptFragment } from './fragments'

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

export const UPLOAD_MANUSCRIPT_FILE = gql`
  mutation UploadFile($id: ID!, $file: Upload!, $fileSize: Int!) {
    uploadManuscript(id: $id, file: $file, fileSize: $fileSize) {
      id
      meta {
        title
      }
      files {
        downloadLink
        filename
        type
        status
        id
      }
      fileStatus
    }
  }
`

export const UPLOAD_SUPPORTING_FILE = gql`
  mutation UploadFile($id: ID!, $file: Upload!) {
    uploadSupportingFile(id: $id, file: $file) {
      id
      meta {
        title
      }
      files {
        downloadLink
        filename
        type
        status
        id
      }
      fileStatus
    }
  }
`

export const DELETE_MANUSCRIPT_FILE = gql`
  mutation UploadFile($id: ID!) {
    removeUploadedManuscript(id: $id) {
      id
      files {
        downloadLink
        filename
        type
        status
        id
      }
    }
  }
`

export const DELETE_SUPPORTING_FILES = gql`
  mutation UploadFile($id: ID!) {
    removeSupportingFiles(id: $id) {
      id
      files {
        downloadLink
        filename
        type
        status
        id
      }
    }
  }
`
