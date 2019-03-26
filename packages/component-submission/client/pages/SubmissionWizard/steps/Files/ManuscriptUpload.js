import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from '@rebass/grid'
import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import { ErrorText } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'
import Paragraph from 'ui/atoms/Paragraph'
import ActionText from 'ui/atoms/ActionText'
import Icon from 'ui/atoms/Icon'
import { errorMessageMapping, MAX_FILE_SIZE } from './utils'

const UploadIcon = props => (
  <Icon
    iconName="Upload"
    overrideName="@pubsweet-pending.FileUpload.Upload"
    {...props}
  />
)

const StyledUploadIcon = styled(UploadIcon)`
  width: ${th('space.5')}
  height: ${th('space.5')}
`

const UploadFailureIcon = props => (
  <Icon
    iconName="XCircle"
    overrideName="@pubsweet-pending.FileUpload.UploadFailure"
    {...props}
  />
)

const StyledUploadFailureIcon = styled(UploadFailureIcon)`
  width: ${th('space.5')}
  height: ${th('space.5')}
`

const UploadSuccessIcon = props => (
  <Icon
    iconName="CheckCircle"
    overrideName="@pubsweet-pending.FileUpload.UploadSuccess"
    {...props}
  />
)

const StyledUploadSuccessIcon = styled(UploadSuccessIcon)`
  width: ${th('space.5')}
  height: ${th('space.5')}
`

const VALID_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const StyledDropzone = styled(({ hasError, saveInnerRef, ...rest }) => (
  <Dropzone ref={saveInnerRef} {...rest} />
))`
  border-style: ${th('borderStyle')};
  border-color: ${({ hasError = false }) =>
    hasError ? th('colorError') : th('colorBorder')};
  border-width: ${th('borderWidth')};
  padding: ${th('space.4')};
`

const UploadInstruction = styled(Paragraph.Writing)`
  margin-bottom: 0;
`

const UploadNote = styled(Paragraph.Writing).attrs({ secondary: true })`
  margin-top: 0;
`

const DropzoneErrorText = styled(ErrorText.withComponent('span'))`
  display: inline;
`

const CentredFlex = styled(Flex)`
  text-align: center;
`
const FileName = styled.p`
  text-size= 14px;
`

const DropzoneContent = ({
  conversion,
  errorMessage,
  dropzoneOpen,
  fileName,
}) => {
  if (conversion.converting) {
    return (
      <React.Fragment>
        <StyledUploadIcon percentage={conversion.progress} />
        <FileName>{fileName}</FileName>
        <UploadInstruction
          data-test-conversion="converting"
          data-test-id="dropzoneMessage"
        >
          Manuscript is uploading {conversion.progress}%
        </UploadInstruction>
      </React.Fragment>
    )
  }

  if (errorMessage) {
    return (
      <React.Fragment>
        <StyledUploadFailureIcon />
        <UploadInstruction
          data-test-conversion="failed"
          data-test-id="dropzoneMessage"
        >
          <DropzoneErrorText>Oops!</DropzoneErrorText> {errorMessage} Please{' '}
          <ActionText onClick={dropzoneOpen}>try again.</ActionText>
        </UploadInstruction>

        <UploadNote>
          Files should be in .docx or .pdf format and no larger than 100MB.
        </UploadNote>
      </React.Fragment>
    )
  }
  if (conversion.completed) {
    return (
      <React.Fragment>
        <StyledUploadSuccessIcon />
        <FileName data-test-id="fileName">{fileName}</FileName>
        <UploadInstruction
          data-test-conversion="completed"
          data-test-id="dropzoneMessage"
        >
          Success! <ActionText onClick={dropzoneOpen}>Replace</ActionText> your
          manuscript.
        </UploadInstruction>
      </React.Fragment>
    )
  }
  return (
    <React.Fragment>
      <StyledUploadIcon />
      <UploadInstruction data-test-id="dropzoneMessage">
        <ActionText onClick={dropzoneOpen}>Upload</ActionText> your manuscript
        or drag it here.
      </UploadInstruction>
      <UploadNote>
        Please note that files larger than 10MB may result in review delays.
      </UploadNote>
    </React.Fragment>
  )
}

class ManuscriptUpload extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      errorMessage: null,
    }
  }

  componentDidUpdate(prevProps) {
    if (
      !this.state.errorMessage &&
      this.props.formError === errorMessageMapping.EMPTY
    ) {
      this.setErrorMessage(this.props.formError)
    }

    if (
      prevProps.formError !== this.props.formError &&
      this.props.formError !== errorMessageMapping.EMPTY
    ) {
      this.setErrorMessage(this.props.formError)
    }

    if (prevProps.conversion.error !== this.props.conversion.error) {
      this.setErrorMessage(
        this.props.conversion.error && errorMessageMapping.UPLOAD_FAILURE,
      )
    }
  }

  setErrorMessage = errorMessage => {
    this.setState({ errorMessage })
  }

  render() {
    const { onDrop, conversion, formError, fileName, ...props } = this.props
    let dropzoneRef
    return (
      <StyledDropzone
        accept={VALID_FILE_TYPES}
        disableClick
        disabled={conversion.converting}
        hasError={this.state.errorMessage && !conversion.converting}
        maxSize={MAX_FILE_SIZE * 1e6}
        onDrop={files => {
          this.setErrorMessage(null)
          this.droppedFileName = files.length && files[0].name
          onDrop(files)
        }}
        saveInnerRef={node => {
          dropzoneRef = node
        }}
        {...props}
      >
        <CentredFlex>
          <Box width={1}>
            <DropzoneContent
              conversion={conversion}
              dropzoneOpen={() => dropzoneRef.open()}
              errorMessage={this.state.errorMessage}
              fileName={this.droppedFileName || fileName}
            />
          </Box>
        </CentredFlex>
      </StyledDropzone>
    )
  }
}

ManuscriptUpload.propTypes = {
  onDrop: PropTypes.func.isRequired,
  conversion: PropTypes.shape({
    completed: PropTypes.bool,
    error: PropTypes.instanceOf(Error),
    converting: PropTypes.bool,
    progress: PropTypes.number,
  }),
  formError: PropTypes.string,
}

ManuscriptUpload.defaultProps = {
  conversion: {},
  formError: '',
}

export default ManuscriptUpload
