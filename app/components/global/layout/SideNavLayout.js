import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Flex, Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'

const SideNavLink = styled(Link)`
  display: block;
  color: ${th('colorTextSecondary')};
  text-decoration: none;
  padding: ${th('space.1')};
  &.active,
  &:hover {
    color: ${th('colorText')};
  }
`

const SideNavLayout = ({ children, navList }) => (
  <Flex flexWrap="wrap">
    <Box is="nav" pr={3} pt={3} width={1 / 5}>
      {navList &&
        navList.map(navItem => (
          <SideNavLink
            className={navItem.active && 'active'}
            key={navItem.link}
            to={navItem.link}
          >
            {navItem.label}
          </SideNavLink>
        ))}
    </Box>
    <Box width={4 / 5}>{children}</Box>
  </Flex>
)

export default SideNavLayout
