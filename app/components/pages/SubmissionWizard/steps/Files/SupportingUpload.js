import React from 'react'
import Dropzone from 'react-dropzone'
import { Flex } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'
import styled, { css } from 'styled-components'
import config from 'config'

import Icon from '../../../../ui/atoms/Icon'

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
  margin-bottom: ${th('space.2')};
  ${props =>
    props.children.length &&
    css`
      border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
    `};
`
const FileBlock = styled(({ uploadError, ...rest }) => <Flex {...rest} />)`
  border-top: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  ${props =>
    props.uploadError
      ? css`
          margin: -1px -1px 0 -1px;
          border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorError')};
        `
      : css`
          &:first-child {
            border-top: none;
          }
        `};
`
const UploadSuccessIcon = styled(props => (
  <Icon
    iconName="CheckCircle"
    overrideName="@pubsweet-pending.FileUpload.UploadSuccess"
    {...props}
  />
))`
  height: ${th('space.3')};
  width: ${th('space.3')};
  margin-right: ${th('space.2')};
`

const UploadFailureIcon = styled(props => (
  <Icon
    iconName="XCircle"
    overrideName="@pubsweet-pending.FileUpload.UploadFailure"
    {...props}
  />
))`
  height: ${th('space.3')};
  width: ${th('space.3')};
  margin-right: ${th('space.2')};
`

const Spinner = styled.span`
  animation: full-rotation 1.1s infinite linear;
  border: 2px solid ${th('colorPrimary')};
  border-left: 2px solid ${th('colorBackground')};
  border-radius: 50%;
  display: inline-block;
  height: ${th('space.3')};
  overflow: hidden;
  text-indent: -9999em;
  transform: translateZ(0);
  width: ${th('space.3')};
  margin-right: ${th('space.2')};
  @keyframes full-rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

// needs to be declared as a const for linting https://eslint.org/docs/rules/func-names
const fileUploadGenerator = function*(files, uploadFile) {
  for (let fileIndex = 0; fileIndex < files.length; ) {
    yield {
      upload: uploadFile(files[fileIndex].file),
      fileId: files[fileIndex].id,
    }
    fileIndex += 1
  }
}

class SupportingUpload extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      uploading: false,
      files: props.files.map((file, index) => ({
        file,
        id: index,
        success: true,
      })),
    }
  }

  synchronouslyUploadFiles = files => {
    const { uploadFile } = this.props
    const iterator = fileUploadGenerator(files, uploadFile)
    const loop = result => {
      if (result.done) {
        this.setState({ uploading: false })
      } else {
        result.value.upload
          .then(data => {
            this.updateFileState(result.value.fileId, {
              success: true,
              loading: false,
            })
          })
          .catch(() => {
            this.updateFileState(result.value.fileId, {
              error: true,
              loading: false,
            })
          })
          .finally(() => loop(iterator.next()))
      }
    }
    loop(iterator.next())
  }

  updateFileState = (fileId, newState) => {
    const newFilesState = [...this.state.files]
    const fileIndex = newFilesState.findIndex(file => file.id === fileId)
    if (fileIndex > -1) {
      newFilesState[fileIndex] = { ...newFilesState[fileIndex], ...newState }
      this.setState({ files: newFilesState })
    }
  }

  render() {
    let dropzoneRef
    const { hasManuscript } = this.props
    const successfullyUploadedFiles = this.state.files.filter(
      file => !file.error,
    )
    return (
      <React.Fragment>
        <StyledDropzone
          maxSize={config.fileUpload.maxSizeMB * 1e6}
          onDrop={droppedFiles => {
            let files = droppedFiles
            if (files.length > 10 - successfullyUploadedFiles.length) {
              files.splice(10 - successfullyUploadedFiles.length)
            }
            files = files.map((file, index) => ({
              id: index + this.state.files.length,
              file,
              loading: true,
            }))

            this.setState({
              uploading: true,
              files: [...this.state.files, ...files],
            })
            this.synchronouslyUploadFiles(files)
          }}
          setRef={node => {
            dropzoneRef = node
          }}
        >
          {this.state.files.map(file => (
            <FileBlock key={file.id} p={2} uploadError={file.error}>
              {file.loading && <Spinner />}
              {file.success && <UploadSuccessIcon />}
              {file.error && <UploadFailureIcon />}
              {file.file.name ? file.file.name : file.file.filename}
            </FileBlock>
          ))}
        </StyledDropzone>
        {successfullyUploadedFiles.length < 10 &&
          hasManuscript &&
          !this.state.uploading && (
            <React.Fragment>
              Add more{' '}
              <UploadLink onClick={() => dropzoneRef.open()}>
                supporting files
              </UploadLink>{' '}
              (optional)
            </React.Fragment>
          )}
      </React.Fragment>
    )
  }
}

export default SupportingUpload
