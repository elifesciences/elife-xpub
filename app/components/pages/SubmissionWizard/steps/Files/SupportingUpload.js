import React from 'react'
import Dropzone from 'react-dropzone'
import { Flex } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'
import styled, { css } from 'styled-components'
import config from 'config'

const UploadLink = styled.span`
  color: ${th('colorPrimary')};
  cursor: pointer;
`

const StyledDropzone = styled(({ setRef, ...rest }) => (
  <Dropzone ref={setRef} {...rest} />
))`
  border-style: none;
  width: auto;
  height: auto;
  margin-bottom: ${th('space.1')};
  ${props =>
    props.children.length &&
    css`
      border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
    `};
`
const FileBlock = styled(Flex)`
  border-top: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
`

class SupportingUpload extends React.Component {
  state = {
    files: [],
  }
  render() {
    let dropzoneRef
    return (
      <React.Fragment>
        <StyledDropzone
          maxSize={config.fileUpload.maxSizeMB * 1e6}
          onDrop={files => {
            // fake upload here
            this.setState({ files: [...this.state.files, ...files] })
          }}
          setRef={node => {
            dropzoneRef = node
          }}
        >
          {this.state.files.map(file => (
            <FileBlock key={file.preview} p={2}>
              {file.name}
            </FileBlock>
          ))}
        </StyledDropzone>
        Add more{' '}
        <UploadLink onClick={() => dropzoneRef.open()}>
          supporting files
        </UploadLink>
        (optional)
      </React.Fragment>
    )
  }
}

export default SupportingUpload
