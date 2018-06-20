import React from 'react'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router-dom'

import StyleRoot from 'pubsweet-client/src/helpers/StyleRoot'
import theme from '@elifesciences/elife-theme'

export default ({ children }) => (
  <ThemeProvider theme={theme}>
    <MemoryRouter>
      <StyleRoot>{children}</StyleRoot>
    </MemoryRouter>
  </ThemeProvider>
)
