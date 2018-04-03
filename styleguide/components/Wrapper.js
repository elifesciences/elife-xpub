import React from 'react'
import { ThemeProvider } from 'styled-components'

import StyleRoot from 'pubsweet-client/src/helpers/StyleRoot'
import theme from '@pubsweet/elife-theme'

export default ({ children }) => (
  <ThemeProvider theme={theme}>
    <StyleRoot>{children}</StyleRoot>
  </ThemeProvider>
)
