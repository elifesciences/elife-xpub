import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'grid-styled'
import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import { th } from '@pubsweet/ui'
import { get } from 'lodash'

const StyledDropzone = styled(Dropzone)`
  border-style: dashed;
`

const Error = styled.div`
  color: ${th('colorError')};
`

const Instruction = styled.div``

const Confirmation = styled.div`
  color: ${th('colorSuccess')};
`

const CentredFlex = styled(Flex)`
  text-align: center;
  min-height: calc(${th('gridUnit')} * 4);
  align-items: center;
`

const FileUpload = ({ onDrop, conversion, instruction }) => (
  <StyledDropzone
    accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    onDrop={onDrop}
  >
    <CentredFlex>
      <Box width={1}>
        <Instruction>{instruction}</Instruction>
        {conversion.error ? (
          <Error>
            {get(conversion, 'error.message', 'Error Uploading File')}
          </Error>
        ) : (
          conversion.completed && <Confirmation>Upload Successful</Confirmation>
        )}
      </Box>
    </CentredFlex>
  </StyledDropzone>
)

FileUpload.propTypes = {
  onDrop: PropTypes.func.isRequired,
  instruction: PropTypes.string.isRequired,
  conversion: PropTypes.shape({
    completed: PropTypes.bool,
    error: PropTypes.instanceOf(Error),
  }),
}

FileUpload.defaultProps = {
  conversion: {},
}

export default FileUpload
