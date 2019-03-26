import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Box } from '@rebass/grid'
import ValidatedField from 'ui/atoms/ValidatedField'
import CoverLetterEditor from './CoverLetterEditor'
import ManuscriptUpload from './ManuscriptUpload'
import SupportingUpload from './SupportingUpload'
import { errorMessageMapping, manuscriptFileTypes } from './utils'

const UPLOAD_MANUSCRIPT_MUTATION = gql`
  mutation UploadFile($id: ID!, $file: Upload!, $fileSize: Int!) {
    uploadManuscript(id: $id, file: $file, fileSize: $fileSize) {
      id
      meta {
        title
      }
      files {
        filename
        type
        status
        id
      }
      fileStatus
    }
  }
`

const UPLOAD_SUPPORTING_MUTATION = gql`
  mutation UploadFile($id: ID!, $file: Upload!) {
    uploadSupportingFile(id: $id, file: $file) {
      id
      meta {
        title
      }
      files {
        filename
        type
        status
        id
      }
      fileStatus
    }
  }
`

const DELETE_MANUSCRIPT_MUTATION = gql`
  mutation UploadFile($id: ID!) {
    removeUploadedManuscript(id: $id) {
      id
      files {
        filename
        type
        status
        id
      }
    }
  }
`

const DELETE_SUPPORTING_FILES_MUTATION = gql`
  mutation UploadFile($id: ID!) {
    removeSupportingFiles(id: $id) {
      id
      files {
        filename
        type
        status
        id
      }
    }
  }
`

function getProgress(loading, uploadProgress) {
  return loading || !uploadProgress ? 0 : uploadProgress
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
  formFunctions.setFieldValue('fileStatus', 'CHANGING')
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
    formFunctions.setFieldValue('fileStatus', data.uploadManuscript.fileStatus)
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
  <Mutation mutation={UPLOAD_MANUSCRIPT_MUTATION}>
    {(uploadFile, { loading, error: uploadError }) => {
      const filesFieldName = 'files'
      const submissionFiles = values[filesFieldName]
      const { MANUSCRIPT_SOURCE, SUPPORTING_FILE } = manuscriptFileTypes
      const manuscriptFileIndex = submissionFiles.findIndex(
        file => file.type === MANUSCRIPT_SOURCE,
      )
      const hasManuscript = manuscriptFileIndex > -1

      let manuscriptFile = {}
      if (hasManuscript) {
        manuscriptFile = submissionFiles[manuscriptFileIndex]
      }

      return (
        <Mutation mutation={DELETE_MANUSCRIPT_MUTATION}>
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
                    converting:
                      loading ||
                      (uploadData.manuscriptUploadProgress &&
                        uploadData.manuscriptUploadProgress < 100),
                    completed: hasManuscript,
                    progress: getProgress(
                      uploadLoading,
                      uploadData.manuscriptUploadProgress,
                    ),
                    error: uploadError,
                  }}
                  data-test-id="upload"
                  fileName={manuscriptFile.filename}
                  formError={touched[filesFieldName] && errors[filesFieldName]}
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
                <Mutation mutation={UPLOAD_SUPPORTING_MUTATION}>
                  {uploadSupportFiles => (
                    <Mutation mutation={DELETE_SUPPORTING_FILES_MUTATION}>
                      {removeSupportFiles => (
                        <SupportingUpload
                          data-test-id="supportingFilesUpload"
                          files={submissionFiles.filter(
                            file => file.type === SUPPORTING_FILE,
                          )}
                          hasManuscript={hasManuscript}
                          removeFiles={() =>
                            removeSupportFiles({
                              variables: { id: values.id },
                            })
                          }
                          uploadFile={file =>
                            new Promise((resolve, reject) => {
                              setFieldValue('fileStatus', 'CHANGING')
                              return uploadSupportFiles({
                                variables: { file, id: values.id },
                              })
                                .then(data => {
                                  setFieldValue(
                                    'fileStatus',
                                    data.data.uploadSupportingFile.fileStatus,
                                  )
                                  resolve(data)
                                })
                                .catch(err => reject(err))
                            })
                          }
                        />
                      )}
                    </Mutation>
                  )}
                </Mutation>
              </Box>
              <ValidatedField
                data-test-id="ongoing-upload-error"
                name="fileStatus"
                type="hidden"
              />
            </React.Fragment>
          )}
        </Mutation>
      )
    }}
  </Mutation>
)

export default FilesPageContainer