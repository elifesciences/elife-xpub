import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'grid-styled'
import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import { ErrorText, Action, th } from '@pubsweet/ui'
import { get } from 'lodash'
import { toClass } from 'recompose'

import Icon from './Icon'

const StyledDropzone = styled(
  toClass(({ hasError, saveInnerRef, ...rest }) => (
    <Dropzone ref={saveInnerRef} {...rest} />
  )),
)`
  border-style: dashed;
  border-color: ${({ hasError = false }) =>
    hasError ? th('colorError') : th('colorBorder')};
`

const Instruction = styled.div``

const CentredFlex = styled(Flex)`
  text-align: center;
  min-height: calc(${th('gridUnit')} * 4);
  align-items: center;
`

const DropzoneContent = ({ conversion, formError, dropzoneOpen }) => {
  if (conversion.error) {
    const errorMessage = get(
      conversion,
      'error.message',
      'Error Uploading File',
    )
    return (
      <div>
        <Icon size={6}>UploadFailure</Icon>
        <ErrorText>
          {errorMessage}. Try to <Action onClick={dropzoneOpen}>upload</Action>{' '}
          your Manuscript again.
        </ErrorText>
      </div>
    )
  }
  if (formError) {
    return (
      <div>
        <Icon size={6}>UploadFailure</Icon>
        <ErrorText>
          Please <Action onClick={dropzoneOpen}>upload</Action> your Manuscript.
        </ErrorText>
      </div>
    )
  }
  if (conversion.converting) {
    return (
      <div>
        <Icon size={6}>Upload</Icon>
        <Instruction>Manuscript is uploading</Instruction>
      </div>
    )
  }
  if (conversion.completed) {
    return (
      <div>
        <Icon size={6}>UploadSuccess</Icon>
        <Instruction>
          Success! <Action to="/manuscript">Preview</Action> or{' '}
          <Action onClick={dropzoneOpen}>replace</Action> your Manuscript.
        </Instruction>
      </div>
    )
  }
  return (
    <div>
      <Icon size={6}>Upload</Icon>
      <Instruction>
        <Action onClick={dropzoneOpen}>Upload</Action> your manuscript or drag
        it here
      </Instruction>
    </div>
  )
}

const FileUpload = ({ onDrop, conversion, formError, ...props }) => {
  let dropzoneRef
  return (
    <StyledDropzone
      accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
  }),
  formError: PropTypes.instanceOf(Error),
}

FileUpload.defaultProps = {
  conversion: {},
  formError: null,
}

export default FileUpload
