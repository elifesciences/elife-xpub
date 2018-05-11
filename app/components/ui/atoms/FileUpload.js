import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'grid-styled'
import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import { ErrorText, Action, th } from '@pubsweet/ui'
import { get } from 'lodash'

const StyledDropzone = styled(Dropzone)`
  border-style: dashed;
`

const Instruction = styled.div``

const CentredFlex = styled(Flex)`
  text-align: center;
  min-height: calc(${th('gridUnit')} * 4);
  align-items: center;
`

const IconUpload = styled.img.attrs({
  src: '/assets/elife-icon-upload.svg',
})``

const IconUploadSuccess = styled.img.attrs({
  src: '/assets/elife-icon-tick.svg',
})``

const IconUploadFailure = styled.img.attrs({
  src: '/assets/elife-icon-cross.svg',
})``

const FileUpload = ({ onDrop, conversion, ...props }) => {
  let content, dropzoneRef
  const dropzoneStyle = {}

  if (conversion.error) {
    dropzoneStyle.borderColor = 'red'

    let displayErrorMessage = ''
    const errorMessage = get(
      conversion,
      'error.message',
      'Error Uploading File',
    )
    if (errorMessage === 'Please upload your manuscript') {
      displayErrorMessage = (
        <ErrorText>
          Please <Action onClick={() => dropzoneRef.open()}>upload</Action> your
          Manuscript.
        </ErrorText>
      )
    } else {
      displayErrorMessage = (
        <ErrorText>
          {errorMessage}. Try to{' '}
          <Action onClick={() => dropzoneRef.open()}>upload</Action> your
          Manuscript again.
        </ErrorText>
      )
    }
    content = (
      <div>
        <IconUploadFailure />
        {displayErrorMessage}
      </div>
    )
  } else if (conversion.converting) {
    content = (
      <div>
        <IconUpload />
        <Instruction>Manuscript is uploading</Instruction>
      </div>
    )
  } else if (conversion.completed) {
    content = (
      <div>
        <IconUploadSuccess />
        <Instruction>
          Success! <Action to="/manuscript">Preview</Action> or{' '}
          <Action onClick={() => dropzoneRef.open()}>replace</Action> your
          Manuscript.
        </Instruction>
      </div>
    )
  } else {
    content = (
      <div>
        <IconUpload />
        <Instruction>
          <Action onClick={() => dropzoneRef.open()}>Upload</Action> your
          manuscript or drag it here
        </Instruction>
      </div>
    )
  }
  return (
    <StyledDropzone
      accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      onDrop={onDrop}
      {...props}
      disableClick
      innerRef={node => {
        dropzoneRef = node
      }}
      style={dropzoneStyle}
    >
      <CentredFlex>
        <Box width={1}>{content}</Box>
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
}

FileUpload.defaultProps = {
  conversion: {},
}

export default FileUpload
