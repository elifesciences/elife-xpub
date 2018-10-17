import { css } from 'styled-components'
import theme from '@elifesciences/elife-theme'

const sizes = {
  mobile: theme.breakpoints[0],
  tabletPortrait: theme.breakpoints[1],
  tabletLandscape: theme.breakpoints[2],
  desktop: theme.breakpoints[3],
}

const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (min-width: ${sizes[label]}px) {
      ${css(...args)};
    }
  `
  return acc
}, {})

export default media
