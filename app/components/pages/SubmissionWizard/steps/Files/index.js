import React from 'react'
import gql from 'graphql-tag'
import { Mutation, Subscription } from 'react-apollo'
import FileUploads from './FileUploads'

const UPLOAD_MUTATION = gql`
  mutation UploadFile($id: ID!, $file: Upload!, $fileSize: Int!) {
    uploadManuscript(id: $id, file: $file, fileSize: $fileSize) {
      id
      meta {
        title
      }
      files {
        filename
        type
      }
    }
  }
`

const ON_UPLOAD_PROGRESS = gql`
  subscription {
    uploadProgress
  }
`

const FileUploadsPage = ({
  setFieldValue,
  errors,
  touched,
  values,
  ...props
}) => (
  <Mutation mutation={UPLOAD_MUTATION}>
    {(uploadFile, { loading, error: uploadError }) => {
      const fieldName = 'files'
      return (
        <Subscription subscription={ON_UPLOAD_PROGRESS}>
          {({ data: uploadData, loading: uploadLoading }) => (
            <FileUploads
              conversion={{
                converting: loading,
                // TODO import this constant from somewhere (data model package?)
                completed: values[fieldName].some(
                  file => file.type === 'MANUSCRIPT_SOURCE',
                ),
                progress: uploadLoading ? 0 : uploadData.uploadProgress,
                error: uploadError,
              }}
              formError={errors[fieldName] && touched[fieldName]}
              onDrop={([file]) =>
                uploadFile({
                  variables: { file, id: values.id, fileSize: file.size },
                }).then(({ data }) => {
                  setFieldValue('meta.title', data.uploadManuscript.meta.title)
                  setFieldValue(fieldName, data.uploadManuscript.files)
                })
              }
              previewUrl={`/manuscript/${values.id}`}
              setFieldValue={setFieldValue}
              {...props}
            />
          )}
        </Subscription>
      )
    }}
  </Mutation>
)

export default FileUploadsPage
