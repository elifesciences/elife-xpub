import { css, withTheme } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const sizes = {
  mobileUp: th('breakpoints.0'),
  tabletPortraitUp: th('breakpoints.1'),
  tabletLandscapeUp: th('breakpoints.2'),
  desktopUp: th('breakpoints.3'),
}

const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (min-width: ${sizes[label]}px) {
      ${css(...args)};
    }
  `
  return acc
}, {})

export default withTheme(media)
