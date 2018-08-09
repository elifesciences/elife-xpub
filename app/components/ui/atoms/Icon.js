import React from 'react'
import { withTheme } from 'styled-components'
import { get, has } from 'lodash'
import * as reactFeatherIcons from 'react-feather'

const Icon = ({ iconName, overrideName, className, theme, ...props }) => {
  const isOverrideInTheme = has(theme.icons, overrideName)
  if (isOverrideInTheme) {
    const OverrideIcon = get(theme.icons, overrideName)
    return <OverrideIcon className={className} {...props} />
  }
  const isIconInDefaultSet = reactFeatherIcons[iconName]
  // TODO: conversation with Pubsweet - what should we default to when
  // there's no obvious react-feather equivalent?
  if (!isIconInDefaultSet) {
    // eslint-disable-next-line no-console
    console.warn("Icon '%s' not found", iconName)
    return null
  }
  const DefaultIcon = reactFeatherIcons[iconName]
  return <DefaultIcon className={className} {...props} />
}

export default withTheme(Icon)
