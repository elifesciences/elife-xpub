import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Box } from '@rebass/grid'
import { ValidatedField } from '@elifesciences/component-elife-ui/client/atoms'
import CoverLetterEditor from './CoverLetterEditor'
import ManuscriptUpload from './ManuscriptUpload'
import SupportingUpload from './SupportingUpload'
import { errorMessageMapping, manuscriptFileTypes } from './utils'

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

function getProgress(uploadProgress) {
  return !uploadProgress ? 0 : uploadProgress
}

export default class FilesPageContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      manuscriptUploading: false,
      manuscriptUploadingError: null,
    }
  }

  getManuscriptSourceFile = () => {
    const { values } = this.props
    const manuscriptFileIndex = values.files.findIndex(
      file => file.type === manuscriptFileTypes.MANUSCRIPT_SOURCE,
    )
    return manuscriptFileIndex > -1 ? values.files[manuscriptFileIndex] : {}
  }

  onFileDrop = files => {
    const {
      setFieldValue,
      setFieldTouched,
      values,
      uploadManuscriptFile,
    } = this.props
    const manuscriptId = values.id

    setFieldTouched('files', true, false)
    setFieldValue('fileStatus', 'CHANGING')

    if (files.length > 1) {
      this.onUploadValidationError(errorMessageMapping.MULTIPLE)
      return
    }

    if (files.length === 0) {
      this.onUploadValidationError(errorMessageMapping.UNSUPPORTED)
      return
    }

    const [file] = files
    this.setState({ manuscriptUploading: true, manuscriptUploadingError: null })
    uploadManuscriptFile({
      variables: { file, id: manuscriptId, fileSize: file.size },
    })
      .then(({ data }) => {
        setFieldValue('meta.title', data.uploadManuscript.meta.title)
        setFieldValue('files', data.uploadManuscript.files)
        setFieldValue('fileStatus', data.uploadManuscript.fileStatus)
        this.setState({ manuscriptUploading: false })
      })
      .catch(error => {
        this.setState({
          manuscriptUploading: false,
          manuscriptUploadingError: error,
        })
      })
  }

  onUploadValidationError = errorMessage => {
    const {
      setFieldError,
      setFieldValue,
      deleteManuscriptFile,
      values,
    } = this.props
    const manuscriptId = values.id

    setFieldError('files', errorMessage)
    deleteManuscriptFile({
      variables: { id: manuscriptId },
    }).then(({ data }) => {
      setFieldValue('files', data.removeUploadedManuscript.files)
    })
  }

  render() {
    const {
      setFieldValue,
      errors,
      touched,
      values,
      manuscriptUploadProgress,
    } = this.props

    const manuscriptFile = this.getManuscriptSourceFile()
    const hasManuscript = !!Object.keys(manuscriptFile).length

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
        <Box mb={3} width={1}>
          <ManuscriptUpload
            conversion={{
              converting:
                this.state.manuscriptUploading ||
                (manuscriptUploadProgress && manuscriptUploadProgress < 100),
              completed: hasManuscript,
              progress: getProgress(manuscriptUploadProgress),
              error: this.state.manuscriptUploadingError,
            }}
            data-test-id="upload"
            fileName={manuscriptFile.filename}
            formError={touched.files && errors.files}
            onDrop={this.onFileDrop}
          />
        </Box>
        <Box width={1}>
          <Mutation mutation={UPLOAD_SUPPORTING_MUTATION}>
            {uploadSupportFiles => (
              <Mutation mutation={DELETE_SUPPORTING_FILES_MUTATION}>
                {removeSupportFiles => (
                  <SupportingUpload
                    data-test-id="supportingFilesUpload"
                    files={values.files.filter(
                      file => file.type === manuscriptFileTypes.SUPPORTING_FILE,
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
    )
  }
}
