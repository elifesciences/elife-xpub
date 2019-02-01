import React from 'react'
import Dropzone from 'react-dropzone'
import { Box, Flex } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'
import styled, { css } from 'styled-components'

import {
  errorMessageMapping,
  MAX_SUPPORTING_FILES,
  MAX_FILE_SIZE,
} from './utils'
import Icon from '../../../../ui/atoms/Icon'

const UploadLink = styled.span`
  color: ${th('colorPrimary')};
  cursor: pointer;
`

const RemoveLink = styled.span`
  cursor: pointer;
  color: ${th('colorPrimary')};
`

const ValidationText = styled.div`
  color: ${th('colorSuccess')};
  margin-top: ${th('space.1')};
  font-size: ${th('fontSizeBaseSmall')};
`

const SectionHeading = styled.span`
  color: ${th('colorTextSecondary')};
  display: inline-block;
  margin-bottom: ${th('space.3')};
  font-size: ${th('fontSizeBaseSmall')};
`

const StyledDropzone = styled(({ setRef, ...rest }) => (
  <Dropzone ref={setRef} {...rest} />
))`
  border-style: none;
  width: auto;
  height: auto;
  margin-bottom: ${th('space.3')};
  ${props =>
    props.children.length &&
    css`
      border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
    `};
`
const FileBlock = styled(({ fileError, ...rest }) => <Flex {...rest} />)`
  border-top: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  ${props =>
    props.fileError
      ? css`
          color: ${th('colorError')};
        `
      : css`
          &:first-child {
            border-top: none;
          }
        `};
`
const FileHolder = styled(Flex)`
  align-items: center;
  flex-wrap: wrap;
`

const FileName = styled.span`
  margin-right: 12px;
`

const IconHolder = styled.div`
  display: flex;
  flex-shrink: 0;
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
  margin-right: ${th('space.3')};
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
  margin-right: ${th('space.3')};
`
const UploadControl = styled(Box).attrs({
  width: 1 / 2,
})`
  display: block;
  text-align: right;
  font-size: ${th('fontSizeBaseSmall')};
  &:first-child {
    text-align: left;
  }
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
  margin-right: ${th('space.3')};
  @keyframes full-rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const ErrorMessage = styled.span`
  font-size: 12px;
`

function* fileUploadGenerator(files, uploadFile, removeSingleFile) {
  for (let fileIndex = 0; fileIndex < files.length; ) {
    console.log('111111111')
    console.log(files[fileIndex].file)
    console.log('222222222')
    console.log(files[fileIndex].file.id)
    yield {
      upload: uploadFile(files[fileIndex].file),
      fileId: files[fileIndex].id,
      remove: removeSingleFile(files[fileIndex].file),
      filename: files[fileIndex].file.name,
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
        success: file.status === 'STORED',
        loading: file.status === 'CREATED' || file.status === 'UPLOADED',
        error: file.status === 'CANCELLED',
      })),
    }
  }

  synchronouslyUploadFiles = files => {
    const { uploadFile } = this.props
    const { removeSingleFile } = this.props
    const iterator = fileUploadGenerator(files, uploadFile, removeSingleFile)
    const loop = result => {
      if (result.done) {
        this.setState({ uploading: false })
      } else {
        console.log(this.state.files)
        
        const index = this.state.files.findIndex(file => // (file.file.filename || file.file.name) === result.value.fileName)
        {
          console.log((file.file.filename || file.file.name))
          console.log(result.value.filename)
          return (file.file.filename || file.file.name) === result.value.filename
        })

        console.log('index from upload:,', index)


        if (index > -1 ) {
          console.log( 'removing time')
          console.log(this.state.files[index].id)
          result.value.remove
          .then(data => {
              console.log('now we have to upload the file again!')
              console.log(result.value)
              console.log(data)
              // this.updateFileState(index, {
              //     success: true,
              //     loading: false,
              //   })
              // result.value.upload
              //   .then(data2 => {
              //     console.log('uploading time...')
              //     console.log(result.value.fileId)
              //     this.updateFileState(result.value.fileId, {
              //       success: true,
              //       loading: false,
              //     })
              //   })
              //   .catch(() => {
              //     this.updateFileState(result.value.fileId, {
              //       error: true,
              //       loading: false,
              //     })
              //   })
              //   .finally(() => loop(iterator.next()))
            })
            .catch((error) => {
              console.log('--------------there was an error')
              console.log(error)
              this.updateFileState(result.value.fileId, {
                error: true,
                loading: false,
              })
            })
          .finally(() => loop(iterator.next()))
      } else {
        result.value.upload
          .then(data => {
            const updatedFile = data.data.uploadSupportingFile.files.filter(
              file => file.filename === result.value.filename,
            )[0]
            this.updateFileState(
              result.value.fileId,
              {
                success: true,
                loading: false,
              },
              updatedFile.id,
            )
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
    }
    loop(iterator.next())
  }

  updateFileState = (fileId, newState, id) => {
    const newFilesState = [...this.state.files]
    const fileIndex = newFilesState.findIndex(file => file.id === fileId)
    if (fileIndex > -1) {
      const updatingState = { ...newFilesState[fileIndex] }
      updatingState.file.id = id
      newFilesState[fileIndex] = { ...updatingState, ...newState }
      this.setState({ files: newFilesState })
    }
  }

  onFileDrop = (acceptedFiles, rejectedFiles) => {
    let storageSpace = MAX_SUPPORTING_FILES - this.state.files.length

    if (storageSpace > 0) {
      const filesToUpload = acceptedFiles
        .slice(0, storageSpace)
        .map((file, index) => ({
          id: index + this.state.files.length,
          file,
          loading: true,
        }))
      if (filesToUpload.length > 0) {
        this.setState({
          uploading: true,
        })
        this.synchronouslyUploadFiles(filesToUpload)
      }
      storageSpace -= filesToUpload.length
      let rejectedFilesToAdd = []
      if (storageSpace > 0) {
        rejectedFilesToAdd = rejectedFiles
          .slice(0, storageSpace)
          .map((file, index) => ({
            id: index + filesToUpload.length + this.state.files.length,
            file,
            loading: false,
            success: false,
            rejected: true,
          }))
      }

      this.setState({
        files: [...this.state.files, ...filesToUpload, ...rejectedFilesToAdd],
      })
    }
  }

  render() {
    let dropzoneRef
    const { hasManuscript, removeFiles } = this.props
    const successfullyUploadedFiles = this.state.files.filter(
      file => !file.error,
    )
    return (
      <React.Fragment>
        {successfullyUploadedFiles.length > 0 && (
          <SectionHeading>Supporting files:</SectionHeading>
        )}
        <StyledDropzone
          data-test-id="supportingFilesUpload"
          maxSize={MAX_FILE_SIZE * 1e6}
          onDrop={this.onFileDrop}
          setRef={node => {
            dropzoneRef = node
          }}
        >
          {this.state.files.map(file => (
            <FileBlock
              fileError={file.error || file.rejected}
              key={file.id}
              p={3}
            >
              <IconHolder>
                {file.loading && <Spinner />}
                {file.success && <UploadSuccessIcon />}
                {(file.error || file.rejected) && <UploadFailureIcon />}
              </IconHolder>
              <FileHolder>
                <FileName data-test-id="file-block-name">
                  {file.file.name ? file.file.name : file.file.filename}
                </FileName>
                {file.rejected && (
                  <ErrorMessage data-test-id="file-block-error">
                    {errorMessageMapping.MAX_SIZE_EXCEEDED}
                  </ErrorMessage>
                )}
              </FileHolder>
            </FileBlock>
          ))}
        </StyledDropzone>
        {hasManuscript &&
          !this.state.uploading && (
            <React.Fragment>
              <Flex>
                {successfullyUploadedFiles.length < MAX_SUPPORTING_FILES && (
                  <React.Fragment>
                    <UploadControl>
                      Add more{' '}
                      <UploadLink
                        data-test-id="supportingFilesLink"
                        onClick={() => dropzoneRef.open()}
                      >
                        supporting files
                      </UploadLink>{' '}
                      (optional)
                    </UploadControl>
                  </React.Fragment>
                )}
                {successfullyUploadedFiles.length > 0 && (
                  <UploadControl>
                    <RemoveLink
                      data-test-id="supportingFilesRemove"
                      onClick={() =>
                        removeFiles().then(() => {
                          this.setState({ files: [] })
                        })
                      }
                    >
                      Remove all
                    </RemoveLink>
                  </UploadControl>
                )}
              </Flex>
            </React.Fragment>
          )}
        {hasManuscript &&
          successfullyUploadedFiles.length > 9 && (
            <ValidationText>
              Maximum {MAX_SUPPORTING_FILES} supporting files
            </ValidationText>
          )}
      </React.Fragment>
    )
  }
}

export default SupportingUpload
