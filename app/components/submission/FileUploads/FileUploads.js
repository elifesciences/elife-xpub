import React from 'react'
import { Flex, Box } from 'grid-styled'
import { H1 } from '@pubsweet/ui'
import FileUpload from '../../ui/atoms/FileUpload'
import ButtonLink from '../../ui/atoms/ButtonLink'
import ProgressBar from '../ProgressBar'

const FileUploads = ({ onDrop, conversion }) => (
  <React.Fragment>
    <ProgressBar currentStep={1} />

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
          conversion={conversion}
          instruction="Drag and drop or click to upload your cover letter"
          onDrop={onDrop}
        />
      </Box>
    </Flex>

    <ButtonLink data-test-id="next" primary to="/submit/metadata">
      Next
    </ButtonLink>
    <ButtonLink to="/submit">Back</ButtonLink>
  </React.Fragment>
)

export default FileUploads
