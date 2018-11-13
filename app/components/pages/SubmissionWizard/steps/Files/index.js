import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Box } from 'grid-styled'
import CoverLetterEditor from './CoverLetterEditor'
import ValidatedField from '../../../../ui/atoms/ValidatedField'
import ManuscriptUpload from './ManuscriptUpload'
import { errorMessageMapping } from './utils'

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
  uploadData,
  uploadLoading,
}) => (
  <Mutation mutation={UPLOAD_MUTATION}>
    {(uploadFile, { loading, error: uploadError }) => {
      const fieldName = 'files'
      return (
        <React.Fragment>
          <Box mb={3} width={1}>
            <ValidatedField
              component={CoverLetterEditor}
              id="coverLetter"
              name="coverLetter"
              onBlur={value => setFieldValue('coverLetter', value)}
              onChange={value => setFieldValue('coverLetter', value)}
            />
          </Box>
          <Box width={1}>
            <ManuscriptUpload
              conversion={{
                converting: loading,
                // TODO import this constant from somewhere (data model package?)
                completed: values[fieldName].some(
                  file => file.type === 'MANUSCRIPT_SOURCE',
                ),
                progress: getProgress(uploadLoading, uploadData),
                error: uploadError,
              }}
              data-test-id="upload"
              formError={touched[fieldName] && errors[fieldName]}
              onDrop={files => {
                setFieldTouched(fieldName, true, false)

                if (files.length > 1) {
                  setFieldError(fieldName, errorMessageMapping.MULTIPLE)
                  return
                }
                if (files.length === 0) {
                  setFieldError(fieldName, errorMessageMapping.UNSUPPORTED)
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
            />
          </Box>
        </React.Fragment>
      )
    }}
  </Mutation>
)

export default FilesPageContainer
