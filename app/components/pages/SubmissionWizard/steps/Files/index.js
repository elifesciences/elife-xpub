import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Box } from 'grid-styled'
import CoverLetterEditor from './CoverLetterEditor'
import ValidatedField from '../../../../ui/atoms/ValidatedField'
import ManuscriptUpload from './ManuscriptUpload'
import SupportingUpload from './SupportingUpload'
import { errorMessageMapping, manuscriptFileTypes } from './utils'

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

const DELETE_MUTATION = gql`
  mutation UploadFile($id: ID!) {
    removeUploadedManuscript(id: $id) {
      id
      files {
        filename
        type
      }
    }
  }
`

function getProgress(loading, data) {
  return loading || !data.uploadProgress ? 0 : data.uploadProgress
}

const onUploadValidationError = (
  formFunctions,
  deleteFile,
  manuscriptId,
  errorMessage,
) => {
  formFunctions.setFieldError('files', errorMessage)
  deleteFile({
    variables: { id: manuscriptId },
  }).then(({ data }) => {
    formFunctions.setFieldValue('files', data.removeUploadedManuscript.files)
  })
}

export const onFileDrop = (
  files,
  formFunctions,
  deleteFile,
  uploadFile,
  manuscriptId,
) => {
  const validationError = errorMessage =>
    onUploadValidationError(
      formFunctions,
      deleteFile,
      manuscriptId,
      errorMessage,
    )

  formFunctions.setFieldTouched('files', true, false)
  if (files.length > 1) {
    validationError(errorMessageMapping.MULTIPLE)
    return
  }
  if (files.length === 0) {
    validationError(errorMessageMapping.UNSUPPORTED)
    return
  }
  const [file] = files
  uploadFile({
    variables: { file, id: manuscriptId, fileSize: file.size },
  }).then(({ data }) => {
    formFunctions.setFieldValue('meta.title', data.uploadManuscript.meta.title)
    formFunctions.setFieldValue('files', data.uploadManuscript.files)
  })
}

const FilesPageContainer = ({
  setFieldValue,
  setFieldError,
  setFieldTouched,
  errors,
  touched,
  values,
  uploadData = {},
  uploadLoading,
}) => (
  <Mutation mutation={UPLOAD_MUTATION}>
    {(uploadFile, { loading, error: uploadError }) => {
      const fieldName = 'files'
      const { MANUSCRIPT_SOURCE } = manuscriptFileTypes
      return (
        <Mutation mutation={DELETE_MUTATION}>
          {deleteFile => (
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
              <Box mb={3} width={1}>
                <ManuscriptUpload
                  conversion={{
                    converting: loading || uploadData.uploadProgress < 100,
                    completed: values[fieldName].some(
                      file => file.type === MANUSCRIPT_SOURCE,
                    ),
                    progress: getProgress(uploadLoading, uploadData),
                    error: uploadError,
                  }}
                  data-test-id="upload"
                  formError={touched[fieldName] && errors[fieldName]}
                  onDrop={files =>
                    onFileDrop(
                      files,
                      {
                        setFieldTouched,
                        setFieldError,
                        setFieldValue,
                      },
                      deleteFile,
                      uploadFile,
                      values.id,
                    )
                  }
                />
              </Box>
              <Box width={1}>
                <SupportingUpload />
              </Box>
            </React.Fragment>
          )}
        </Mutation>
      )
    }}
  </Mutation>
)

export default FilesPageContainer
