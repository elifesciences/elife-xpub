/* eslint-disable react/jsx-sort-props */

import React from 'react'
import { Box } from 'grid-styled'
import ConfigurableEditor from 'xpub-edit/src/components/configurable/ConfigurableEditor'
import FileUpload from '../../../ui/molecules/FileUpload'
import ValidatedField from '../../../ui/atoms/ValidatedField'
import IconTextBold from '../../../ui/atoms/icons/TextBold'
import IconTextItalic from '../../../ui/atoms/icons/TextItalic'
import IconTextUnderline from '../../../ui/atoms/icons/TextUnderline'
import IconTextSub from '../../../ui/atoms/icons/TextSub'
import IconTextSup from '../../../ui/atoms/icons/TextSup'

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
  setFieldValue,
  onDrop,
  conversion,
  formError,
  previewUrl,
}) => (
  <React.Fragment>
    <Box mb={3} width={1}>
      <ValidatedField
        component={Editor}
        id="coverLetter"
        name="submissionMeta.coverLetter"
        onBlur={value => setFieldValue('submissionMeta.coverLetter', value)}
        onChange={value => setFieldValue('submissionMeta.coverLetter', value)}
      />
    </Box>
    <Box width={1}>
      <FileUpload
        conversion={conversion}
        data-test-id="upload"
        formError={formError}
        onDrop={onDrop}
        previewUrl={previewUrl}
      />
    </Box>
  </React.Fragment>
)

export default FileUploads
