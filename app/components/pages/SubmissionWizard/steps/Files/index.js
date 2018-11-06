import React from 'react'
import gql from 'graphql-tag'
import { Mutation, Subscription } from 'react-apollo'
import FilesPage from './FilesPage'

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

function getProgress(loading, data) {
  if (loading || !data) return 0
  return data.uploadProgress
}

const FilesPageContainer = ({
  setFieldValue,
  setFieldError,
  setFieldTouched,
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
            <FilesPage
              conversion={{
                converting: loading,
                // TODO import this constant from somewhere (data model package?)
                completed: values[fieldName].some(
                  file => file.type === 'MANUSCRIPT_SOURCE',
                ),
                progress: getProgress(uploadLoading, uploadData),
                error: uploadError,
              }}
              formError={touched[fieldName] && errors[fieldName]}
              onDrop={files => {
                setFieldTouched(fieldName, true, false)

                if (files.length > 1) {
                  setFieldError(fieldName, 'Only one file can be uploaded.')
                  return
                }
                if (files.length === 0) {
                  setFieldError(fieldName, 'That file is not supported.')
                  return
                }

                const [file] = files
                uploadFile({
                  variables: { file, id: values.id, fileSize: file.size },
                }).then(({ data }) => {
                  setFieldValue('meta.title', data.uploadManuscript.meta.title)
                  setFieldValue(fieldName, data.uploadManuscript.files)
                })
              }}
              setFieldValue={setFieldValue}
              {...props}
            />
          )}
        </Subscription>
      )
    }}
  </Mutation>
)

export default FilesPageContainer
