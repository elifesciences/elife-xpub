import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import FileUploads from './FileUploads'

const UPLOAD_MUTATION = gql`
  mutation UploadFile($id: ID!, $file: Upload!) {
    uploadManuscript(id: $id, file: $file) {
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
              setFieldValue('meta.title', data.uploadManuscript.meta.title)
              setFieldValue(fieldName, data.uploadManuscript.files)
            })
          }
          previewUrl={`/manuscript/${values.id}`}
          setFieldValue={setFieldValue}
          {...props}
        />
      )
    }}
  </Mutation>
)

export default FileUploadsPage
