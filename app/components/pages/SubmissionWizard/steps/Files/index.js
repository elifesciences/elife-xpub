import React from 'react'
import gql from 'graphql-tag'
import { Mutation, withApollo } from 'react-apollo'
import { Box } from '@rebass/grid'
import CoverLetterEditor from './CoverLetterEditor'
import ValidatedField from '../../../../ui/atoms/ValidatedField'
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
      }
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
      }
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

class FilesPageContainer extends React.Component {
  render() {
    const {
      setFieldValue,
      setFieldError,
      setFieldTouched,
      errors,
      touched,
      values,
      uploadData = {},
      uploadLoading,
    } = this.props

    return (
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
                        converting: loading || uploadData.uploadProgress < 100,
                        completed: hasManuscript,
                        progress: getProgress(uploadLoading, uploadData),
                        error: uploadError,
                      }}
                      data-test-id="upload"
                      fileName={manuscriptFile.filename}
                      formError={
                        touched[filesFieldName] && errors[filesFieldName]
                      }
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
                              uploadFile={file => {
                                this.props.client.readFragment({
                                  id: this.props.manuscriptId,
                                  fragment: gql`
                                    fragment justFiles on Manuscript {
                                      __typename
                                      files {
                                        type
                                        filename
                                        status
                                      }
                                    }
                                  `,
                                })
                                return new Promise((resolve, reject) =>
                                  uploadSupportFiles({
                                    variables: { file, id: values.id },
                                  })
                                    .then(data => resolve(data))
                                    .catch(err => reject(err)),
                                )
                              }}
                            />
                          )}
                        </Mutation>
                      )}
                    </Mutation>
                  </Box>
                </React.Fragment>
              )}
            </Mutation>
          )
        }}
      </Mutation>
    )
  }
}

export default withApollo(FilesPageContainer)
