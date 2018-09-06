import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'grid-styled'
import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import { ErrorText, Action } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'
import { get } from 'lodash'

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

const Instruction = styled.div`
  margin-top: ${th('space.3')};
`

const CentredFlex = styled(Flex)`
  text-align: center;
`

const DropzoneContent = ({
  conversion,
  formError,
  dropzoneOpen,
  previewUrl,
}) => {
  if (conversion.converting) {
    return (
      <React.Fragment>
        <StyledUploadIcon />
        <Instruction data-test-id="dropzoneMessage">
          Manuscript is uploading
        </Instruction>
      </React.Fragment>
    )
  }
  if (conversion.error) {
    const errorMessage = get(
      conversion,
      'error.message',
      'Error Uploading File',
    )
    return (
      <React.Fragment>
        <StyledUploadFailureIcon />
        <ErrorText data-test-id="dropzoneMessage">
          {errorMessage}. Try to <Action onClick={dropzoneOpen}>upload</Action>{' '}
          your manuscript again.
        </ErrorText>
      </React.Fragment>
    )
  }
  if (formError) {
    return (
      <React.Fragment>
        <StyledUploadFailureIcon />
        <ErrorText data-test-id="dropzoneMessage">
          Please <Action onClick={dropzoneOpen}>upload</Action> your manuscript.
        </ErrorText>
      </React.Fragment>
    )
  }
  if (conversion.completed) {
    return (
      <React.Fragment>
        <StyledUploadSuccessIcon />
        <Instruction data-test-id="dropzoneMessage">
          Success!{' '}
          <Action data-test-id="preview" to={previewUrl}>
            Preview
          </Action>{' '}
          or <Action onClick={dropzoneOpen}>replace</Action> your manuscript.
        </Instruction>
      </React.Fragment>
    )
  }
  return (
    <React.Fragment>
      <StyledUploadIcon />
      <Instruction data-test-id="dropzoneMessage">
        <Action onClick={dropzoneOpen}>Upload</Action> your manuscript or drag
        it here.
      </Instruction>
    </React.Fragment>
  )
}

const FileUpload = ({
  onDrop,
  conversion,
  formError,
  previewUrl,
  ...props
}) => {
  let dropzoneRef
  return (
    <StyledDropzone
      accept={VALID_FILE_TYPES}
      onDrop={onDrop}
      {...props}
      disableClick
      hasError={!!(formError || conversion.error)}
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
            previewUrl={previewUrl}
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
  formError: PropTypes.bool,
}

FileUpload.defaultProps = {
  conversion: {},
  formError: false,
}

export default FileUpload
