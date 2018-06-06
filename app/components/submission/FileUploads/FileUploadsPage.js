import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import _ from 'lodash'
import FileUploads from './FileUploads'

const UPLOAD_MUTATION = gql`
  mutation UploadFile($id: ID!, $file: Upload!) {
    uploadManuscript(id: $id, file: $file) {
      id
      title
      files {
        name
        type
      }
    }
  }
`

const FileUploadsPage = ({
  manuscriptId,
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
        <FileUploads
          conversion={{
            converting: loading,
            // TODO import this constant from somewhere (data model package?)
            completed: values[fieldName].some(
              file => file.type === 'MANUSCRIPT_SOURCE',
            ),
            error: uploadError,
          }}
          formError={errors[fieldName] && touched[fieldName]}
          onDrop={([file]) =>
            uploadFile({
              variables: { file, id: values.id },
            }).then(({ data }) => {
              setFieldValue('title', data.uploadManuscript.title)
              setFieldValue(fieldName, data.uploadManuscript.files)
            })
          }
          setFieldValue={setFieldValue}
          {...props}
        />
      )
    }}
  </Mutation>
)

export default FileUploadsPage
