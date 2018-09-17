import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'grid-styled'
import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import { ErrorText, Action } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'
import config from 'config'

import Icon from '../atoms/Icon'

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
  border-style: dashed;
  border-color: ${({ hasError = false }) =>
    hasError ? th('colorError') : th('colorBorder')};
  border-width: 2px;
  padding: ${th('space.4')};
`

const UploadInstruction = styled.p`
  margin-bottom: 0;
`

const UploadNote = styled.p`
  color: ${th('colorTextSecondary')};
  margin-top: 0;
`

const DropzoneErrorText = styled(ErrorText.withComponent('span'))`
  display: inline;
`

const CentredFlex = styled(Flex)`
  text-align: center;
`

const DropzoneContent = ({ conversion, formError, dropzoneOpen }) => {
  if (conversion.converting) {
    return (
      <React.Fragment>
        <StyledUploadIcon />
        <UploadInstruction data-test-id="dropzoneMessage">
          Manuscript is uploading
        </UploadInstruction>
      </React.Fragment>
    )
  }
  const displayError = conversion.error
    ? 'Unable to upload manuscript.'
    : formError

  if (displayError) {
    return (
      <React.Fragment>
        <StyledUploadFailureIcon />
        <UploadInstruction data-test-id="dropzoneMessage">
          <DropzoneErrorText>Oops!</DropzoneErrorText> {displayError} Please{' '}
          <Action onClick={dropzoneOpen}>try again.</Action>
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
        <UploadInstruction data-test-id="dropzoneMessage">
          Success! <Action onClick={dropzoneOpen}>Replace</Action> your
          manuscript.
        </UploadInstruction>
      </React.Fragment>
    )
  }
  return (
    <React.Fragment>
      <StyledUploadIcon />
      <UploadInstruction data-test-id="dropzoneMessage">
        <Action onClick={dropzoneOpen}>Upload</Action> your manuscript or drag
        it here.
      </UploadInstruction>
      <UploadNote>
        Please note that files larger than 10MB may result in review delays.
      </UploadNote>
    </React.Fragment>
  )
}

const FileUpload = ({ onDrop, conversion, formError, ...props }) => {
  let dropzoneRef
  return (
    <StyledDropzone
      accept={VALID_FILE_TYPES}
      onDrop={onDrop}
      {...props}
      disableClick
      hasError={!!(formError || conversion.error)}
      maxSize={config.fileUpload.maxSizeMB * 1e6}
      saveInnerRef={node => {
        dropzoneRef = node
      }}
    >
      <CentredFlex>
        <Box width={1}>
          <DropzoneContent
            conversion={conversion}
            dropzoneOpen={() => dropzoneRef.open()}
            formError={formError}
          />
        </Box>
      </CentredFlex>
    </StyledDropzone>
  )
}

FileUpload.propTypes = {
  onDrop: PropTypes.func.isRequired,
  conversion: PropTypes.shape({
    completed: PropTypes.bool,
    error: PropTypes.instanceOf(Error),
    converting: PropTypes.bool,
    progress: PropTypes.number,
  }),
  formError: PropTypes.string,
}

FileUpload.defaultProps = {
  conversion: {},
  formError: '',
}

export default FileUpload
