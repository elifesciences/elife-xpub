/**
 * Designed to be used inside NotificationRibbon
 */

import styled from 'styled-components'
import { Action } from '@pubsweet/ui'

export default styled(Action)`
  cursor: pointer;
  text-decoration: underline;
  font: inherit;
  font-size: inherit;
  color: inherit;

  &:hover,
  &:focus,
  &:active {
    color: inherit;
  }
`
