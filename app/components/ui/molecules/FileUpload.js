import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'grid-styled'
import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import { ErrorText, Action } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'
import { get } from 'lodash'

import Icon from '../atoms/Icon'

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
        <Icon size={5}>Upload</Icon>
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
        <Icon size={5}>UploadFailure</Icon>
        <ErrorText data-test-id="dropzoneMessage">
          {errorMessage}. Try to <Action onClick={dropzoneOpen}>upload</Action>{' '}
          your Manuscript again.
        </ErrorText>
      </React.Fragment>
    )
  }
  if (formError) {
    return (
      <React.Fragment>
        <Icon size={5}>UploadFailure</Icon>
        <ErrorText data-test-id="dropzoneMessage">
          Please <Action onClick={dropzoneOpen}>upload</Action> your Manuscript.
        </ErrorText>
      </React.Fragment>
    )
  }
  if (conversion.completed) {
    return (
      <React.Fragment>
        <Icon size={5}>UploadSuccess</Icon>
        <Instruction data-test-id="dropzoneMessage">
          Success!{' '}
          <Action data-test-id="preview" to={previewUrl}>
            Preview
          </Action>{' '}
          or <Action onClick={dropzoneOpen}>replace</Action> your Manuscript.
        </Instruction>
      </React.Fragment>
    )
  }
  return (
    <React.Fragment>
      <Icon size={5}>Upload</Icon>
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
  }),
  formError: PropTypes.bool,
}

FileUpload.defaultProps = {
  conversion: {},
  formError: false,
}

export default FileUpload
