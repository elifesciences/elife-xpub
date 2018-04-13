import React from 'react'
import { Flex, Box } from 'grid-styled'
import { H1 } from '@pubsweet/ui'
import FileUpload from '../ui/atoms/FileUpload'
import ButtonLink from '../ui/atoms/ButtonLink'

const FileUploads = () => (
  <React.Fragment>
    <H1>Upload your manuscript and cover letter</H1>

    <Flex flexDirection="column">
      <Box mb={3} width={1}>
        <FileUpload
          instruction="Drag and drop or click to upload your manuscript"
          onDrop={x => x}
        />
      </Box>
      <Box mb={3} width={1}>
        <FileUpload
          instruction="Drag and drop or click to upload your cover letter"
          onDrop={x => x}
        />
      </Box>
    </Flex>

    <ButtonLink primary to="/submit/metadata">
      Next
    </ButtonLink>
    <ButtonLink to="/submit">Back</ButtonLink>
  </React.Fragment>
)

export default FileUploads
