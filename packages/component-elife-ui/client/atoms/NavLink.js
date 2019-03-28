import styled from 'styled-components'
import { NavLink as RouterNavLink } from 'react-router-dom'
import { th } from '@pubsweet/ui-toolkit'

const NavLink = styled(RouterNavLink)`
  color: ${th('colorTextSecondary')};
  text-decoration: none;
  line-height: ${th('fontLineHeightBase')};
  &:hover,
  &.active {
    color: ${th('colorText')};
  }
`

export default NavLink
