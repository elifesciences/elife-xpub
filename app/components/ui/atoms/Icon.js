import React from 'react'
import { withTheme } from 'styled-components'
import { get, has } from 'lodash'
import * as reactFeatherIcons from 'react-feather'

const Icon = ({ iconName, overrideName, className, theme, ...props }) => {
  const DefaultIcon = reactFeatherIcons[iconName]
  const OverrideIcon = get(theme.icons, overrideName)
  const isDefaultIcon = !has(theme.icons, overrideName)
  return isDefaultIcon ? (
    <DefaultIcon className={className} {...props} />
  ) : (
    <OverrideIcon className={className} {...props} />
  )
}

export default withTheme(Icon)
