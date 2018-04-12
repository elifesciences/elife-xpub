import React from 'react'
import { Flex, Box } from 'grid-styled'
import { Button } from '@pubsweet/ui'
import { withRouter } from 'react-router'
import FileUpload from '../ui/atoms/FileUpload'

const FileUploads = ({ history }) => (
  <React.Fragment>
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
    <Flex>
      <Box>
        <Button
          onClick={() => history.push('/submit/metadata')}
          primary
          type="button"
        >
          Next
        </Button>
      </Box>
      <Box>
        <Button onClick={() => history.push('/submit')} secondary type="button">
          Back
        </Button>
      </Box>
    </Flex>
  </React.Fragment>
)

export default withRouter(FileUploads)
