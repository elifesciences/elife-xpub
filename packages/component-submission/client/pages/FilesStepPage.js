import React from 'react'
import { Box } from '@rebass/grid'
import { compose, withProps } from 'recompose'
import { ValidatedField } from '@elifesciences/component-elife-ui/client/atoms'
import CoverLetterEditor from '../components/CoverLetterEditor'
import ManuscriptUpload from '../components/ManuscriptUpload'
import SupportingUpload from '../components/SupportingUpload'
import { errorMessageMapping, manuscriptFileTypes } from '../utils/constants'
import filesWithGQL from '../graphql/filesWithGQL'

export class FilesStepPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // Revisit this once https://github.com/apollographql/react-apollo/issues/2952 has been implemented.
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
      manuscriptUploadProgress = 0,
      uploadSupportingFile,
      deleteSupportingFiles,
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
                (manuscriptUploadProgress > 0 &&
                  manuscriptUploadProgress < 100),
              completed: hasManuscript,
              progress: manuscriptUploadProgress,
              error: this.state.manuscriptUploadingError,
            }}
            data-test-id="upload"
            fileName={manuscriptFile.filename}
            formError={touched.files && errors.files}
            onDrop={this.onFileDrop}
          />
        </Box>
        <Box width={1}>
          <SupportingUpload
            data-test-id="supportingFilesUpload"
            files={values.files.filter(
              file => file.type === manuscriptFileTypes.SUPPORTING_FILE,
            )}
            hasManuscript={hasManuscript}
            removeFiles={() =>
              deleteSupportingFiles({
                variables: { id: values.id },
              })
            }
            uploadFile={file =>
              new Promise((resolve, reject) => {
                setFieldValue('fileStatus', 'CHANGING')
                return uploadSupportingFile({
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

export default compose(
  filesWithGQL,
  withProps(props => ({
    manuscriptUploadProgress: props.uploadProgress.manuscriptUploadProgress,
  })),
)(FilesStepPage)
