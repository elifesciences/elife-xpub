import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import FileUploads from './FileUploads'

const UPLOAD_MUTATION = gql`
  mutation UploadFile($file: Upload!) {
    upload(file: $file) {
      url
    }
  }
`

export default () => (
  <Mutation mutation={UPLOAD_MUTATION}>
    {(uploadFile, { data, loading, error }) => (
      <FileUploads
        conversion={{ converting: loading, completed: data, error }}
        onDrop={([file]) => uploadFile({ variables: { file } })}
      />
    )}
  </Mutation>
)
