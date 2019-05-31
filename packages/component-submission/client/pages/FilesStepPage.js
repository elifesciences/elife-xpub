import React from 'react'
import { Box } from '@rebass/grid'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { compose, withProps } from 'recompose'
import {
  ValidatedField,
  FormH2,
  Paragraph,
} from '@elifesciences/component-elife-ui/client/atoms'
import CoverLetterEditor from '../components/CoverLetterEditor'
import ManuscriptUpload from '../components/ManuscriptUpload'
import SupportingUpload from '../components/SupportingUpload'
import { errorMessageMapping, manuscriptFileTypes } from '../utils/constants'
import filesWithGQL from '../graphql/filesWithGQL'

const SmallUL = styled.ul`
  font-size: ${th('fontSizeBaseSmall')};
`
export class FilesStepPageComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // Revisit this once https://github.com/apollographql/react-apollo/issues/2952 has been implemented.
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
      setIsUploading,
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
    this.setState({ manuscriptUploadingError: null })

    setIsUploading(true)
    uploadManuscriptFile({
      variables: { file, id: manuscriptId, fileSize: file.size },
    })
      .then(({ data }) => {
        setFieldValue('meta.title', data.uploadManuscript.meta.title)
        setFieldValue('files', data.uploadManuscript.files)
        setFieldValue('fileStatus', data.uploadManuscript.fileStatus)
      })
      .catch(error => {
        this.setState({
          manuscriptUploadingError: error,
        })
      })
      .then(() => {
        setIsUploading(false)
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
          <FormH2>Your cover letter</FormH2>
          <Paragraph.Small secondary>
            Please enter or paste in your cover letter below. To help with the
            initial evaluation of your submission, you should aim to answer the
            following questions:
          </Paragraph.Small>
          <SmallUL>
            <li>
              How will your work make others in the field think differently and
              move the field forward?
            </li>
            <li>
              How does your work relate to the current literature on the topic?
            </li>
            <li>
              Who do you consider to be the most relevant audience for this
              work?
            </li>
            <li>
              Have you made clear in the letter what the work has and has not
              achieved?
            </li>
          </SmallUL>
          <Paragraph.Small secondary>
            In addition, please upload any related studies that you have
            published recently or have under consideration elsewhere as
            supporting files and describe them in your cover letter.
          </Paragraph.Small>
          <ValidatedField
            component={CoverLetterEditor}
            id="coverLetter"
            name="coverLetter"
            onBlur={value => setFieldValue('coverLetter', value)}
            onChange={value => setFieldValue('coverLetter', value)}
          />
        </Box>
        <Box mb={3} width={1}>
          <FormH2>Your manuscript file</FormH2>
          <ManuscriptUpload
            conversion={{
              converting:
                this.props.isUploading ||
                (manuscriptUploadProgress > 0 &&
                  manuscriptUploadProgress < 100),
              completed: hasManuscript,
              progress: manuscriptUploadProgress,
              error: this.state.manuscriptUploadingError,
            }}
            data-test-id="upload"
            downloadLink={manuscriptFile.downloadLink}
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
)(FilesStepPageComponent)
