import { css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

export default css`
  // Action is sometimes a Link underneath & sometimes a Button
  // eLife styling makes a button's font: Noto Sans SemiBold
  // This reverses that override
  font-family: ${th('fontInterface')};
`
