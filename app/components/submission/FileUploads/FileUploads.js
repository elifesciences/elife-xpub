/* eslint-disable react/jsx-sort-props */

import React from 'react'
import { Flex, Box } from 'grid-styled'
import { Button } from '@pubsweet/ui'
import ConfigurableEditor from 'xpub-edit/src/components/configurable/ConfigurableEditor'
import { FormH2 } from '../../ui/atoms/FormHeadings'
import ButtonLink from '../../ui/atoms/ButtonLink'
import FileUpload from '../../ui/molecules/FileUpload'
import ValidatedField from '../../ui/atoms/ValidatedField'
import IconTextBold from '../../ui/atoms/icons/TextBold'
import IconTextItalic from '../../ui/atoms/icons/TextItalic'
import IconTextUnderline from '../../ui/atoms/icons/TextUnderline'
import IconTextSub from '../../ui/atoms/icons/TextSub'
import IconTextSup from '../../ui/atoms/icons/TextSup'
import ProgressBar from '../ProgressBar'

// order of props affects order of menu buttons
const Editor = ({ validationStatus, ...props }) => (
  <ConfigurableEditor
    bold={{ icon: <IconTextBold /> }}
    italic={{ icon: <IconTextItalic /> }}
    underline={{ icon: <IconTextUnderline /> }}
    subscript={{ icon: <IconTextSub /> }}
    superscript={{ icon: <IconTextSup /> }}
    {...props}
  />
)

const FileUploads = ({
  handleSubmit,
  setFieldValue,
  onDrop,
  conversion,
  formError,
}) => (
  <form onSubmit={handleSubmit}>
    <ProgressBar currentStep={1} />

    <FormH2>Write your cover letter and upload your manuscript</FormH2>

    <Flex flexDirection="column">
      <Box mb={3} width={1}>
        <ValidatedField
          component={Editor}
          id="coverLetter"
          name="submissionMeta.coverLetter"
          onBlur={value => setFieldValue('submissionMeta.coverLetter', value)}
          onChange={value => setFieldValue('submissionMeta.coverLetter', value)}
        />
      </Box>
      <Box mb={3} width={1}>
        <FileUpload
          conversion={conversion}
          data-test-id="upload"
          formError={formError}
          onDrop={onDrop}
        />
      </Box>
    </Flex>

    <ButtonLink to="/submit">Back</ButtonLink>
    <Button data-test-id="next" primary type="submit">
      Next
    </Button>
  </form>
)

export default FileUploads
