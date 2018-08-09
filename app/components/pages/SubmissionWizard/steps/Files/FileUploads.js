/* eslint-disable react/jsx-sort-props */

import React from 'react'
import { Box } from 'grid-styled'
import ConfigurableEditor from 'xpub-edit/src/components/configurable/ConfigurableEditor'

import Icon from '../../../../ui/atoms/Icon'
import FileUpload from '../../../../ui/molecules/FileUpload'
import ValidatedField from '../../../../ui/atoms/ValidatedField'

const TextBoldIcon = props => (
  <Icon
    iconName="Bold"
    overrideName="@pubsweet-pending.FileUploads.Editor.bold"
    {...props}
  />
)

const TextItalicIcon = props => (
  <Icon
    iconName="Italic"
    overrideName="@pubsweet-pending.FileUploads.Editor.italic"
    {...props}
  />
)

const TextUnderlineIcon = props => (
  <Icon
    iconName="Underline"
    overrideName="@pubsweet-pending.FileUploads.Editor.underline"
    {...props}
  />
)

const TextSubIcon = props => (
  <Icon
    // TODO: conversation with Pubsweet - what should we default to
    // when there's no obvious react-feather equivalent?
    iconName=""
    overrideName="@pubsweet-pending.FileUploads.Editor.sub"
    {...props}
  />
)

const TextSupIcon = props => (
  <Icon
    // TODO: conversation with Pubsweet - what should we default to
    // when there's no obvious react-feather equivalent?
    iconName=""
    overrideName="@pubsweet-pending.FileUploads.Editor.sup"
    {...props}
  />
)

// order of props affects order of menu buttons
const Editor = ({ validationStatus, ...props }) => (
  <ConfigurableEditor
    bold={{ icon: <TextBoldIcon /> }}
    italic={{ icon: <TextItalicIcon /> }}
    underline={{ icon: <TextUnderlineIcon /> }}
    subscript={{ icon: <TextSubIcon /> }}
    superscript={{ icon: <TextSupIcon /> }}
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
        name="coverLetter"
        onBlur={value => setFieldValue('coverLetter', value)}
        onChange={value => setFieldValue('coverLetter', value)}
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
