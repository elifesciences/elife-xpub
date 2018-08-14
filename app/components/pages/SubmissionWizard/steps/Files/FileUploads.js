/* eslint-disable react/jsx-sort-props */

import React from 'react'
import { Box } from 'grid-styled'
import ConfigurableEditor from 'xpub-edit/src/components/configurable/ConfigurableEditor'

import Icon from '../../../../ui/atoms/Icon'
import FileUpload from '../../../../ui/molecules/FileUpload'
import ValidatedField from '../../../../ui/atoms/ValidatedField'

const FormatBoldIcon = props => (
  <Icon
    iconName="Bold"
    overrideName="@pubsweet-pending.FileUploads.Editor.Bold"
    {...props}
  />
)

const FormatItalicIcon = props => (
  <Icon
    iconName="Italic"
    overrideName="@pubsweet-pending.FileUploads.Editor.Italic"
    {...props}
  />
)

const FormatUnderlineIcon = props => (
  <Icon
    iconName="Underline"
    overrideName="@pubsweet-pending.FileUploads.Editor.Underlined"
    {...props}
  />
)

const FormatSubscriptIcon = props => (
  <Icon
    // TODO: conversation with Pubsweet - what should we default to
    // when there's no obvious react-feather equivalent?
    iconName=""
    overrideName="@pubsweet-pending.FileUploads.Editor.Subscript"
    {...props}
  />
)

const FormatSuperscriptIcon = props => (
  <Icon
    // TODO: conversation with Pubsweet - what should we default to
    // when there's no obvious react-feather equivalent?
    iconName=""
    overrideName="@pubsweet-pending.FileUploads.Editor.Superscript"
    {...props}
  />
)

// order of props affects order of menu buttons
const Editor = ({ validationStatus, ...props }) => (
  <ConfigurableEditor
    bold={{ icon: <FormatBoldIcon /> }}
    italic={{ icon: <FormatItalicIcon /> }}
    underline={{ icon: <FormatUnderlineIcon /> }}
    subscript={{ icon: <FormatSubscriptIcon /> }}
    superscript={{ icon: <FormatSuperscriptIcon /> }}
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
