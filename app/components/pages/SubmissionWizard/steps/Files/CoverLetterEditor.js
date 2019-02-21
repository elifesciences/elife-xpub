import React from 'react'
import ConfigurableEditor from 'xpub-edit/src/components/configurable/ConfigurableEditor'
import Icon from 'ui/atoms/Icon'

const FormatBoldIcon = props => (
  <Icon
    iconName="Bold"
    overrideName="@pubsweet-pending.FilesPage.Editor.Bold"
    {...props}
  />
)

const FormatItalicIcon = props => (
  <Icon
    iconName="Italic"
    overrideName="@pubsweet-pending.FilesPage.Editor.Italic"
    {...props}
  />
)

const FormatUnderlineIcon = props => (
  <Icon
    iconName="Underline"
    overrideName="@pubsweet-pending.FilesPage.Editor.Underlined"
    {...props}
  />
)

const FormatSubscriptIcon = props => (
  <Icon
    // TODO: conversation with Pubsweet - what should we default to
    // when there's no obvious react-feather equivalent?
    iconName=""
    overrideName="@pubsweet-pending.FilesPage.Editor.Subscript"
    {...props}
  />
)

const FormatSuperscriptIcon = props => (
  <Icon
    // TODO: conversation with Pubsweet - what should we default to
    // when there's no obvious react-feather equivalent?
    iconName=""
    overrideName="@pubsweet-pending.FilesPage.Editor.Superscript"
    {...props}
  />
)

// order of props affects order of menu buttons
const CoverLetterEditor = ({ validationStatus, ...props }) => (
  <ConfigurableEditor
    bold={{ icon: <FormatBoldIcon /> }}
    data-hj-suppress=""
    italic={{ icon: <FormatItalicIcon /> }}
    subscript={{ icon: <FormatSubscriptIcon /> }}
    superscript={{ icon: <FormatSuperscriptIcon /> }}
    underline={{ icon: <FormatUnderlineIcon /> }}
    {...props}
  />
)

export default CoverLetterEditor
