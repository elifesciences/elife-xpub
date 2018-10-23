import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const ScrollContainer = styled.div`
  overflow-x: auto;
  &:not(:last-child) {
    margin-bottom: ${th('space.3')};
  }
`

const Table = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
`

export const Tr = styled.tr`
  &:hover {
    background-color: aliceblue;
  }
`

export const Th = styled.th`
  background-color: ${th('colorSecondary')};
  font-size: 12px;
  padding: ${th('space.1')};
  border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
`

export const Td = styled.td`
  font-size: 12px;
  padding: ${th('space.1')};
  border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
`

const RefTable = ({ thead, tfoot, children }) => (
  <ScrollContainer>
    <Table>
      {thead && <thead>{thead}</thead>}
      <tbody>{children}</tbody>
      {tfoot && <tfoot>{tfoot}</tfoot>}
    </Table>
  </ScrollContainer>
)

export const Footer = styled.ul`
  list-style: none;
  padding: 0;
  // assume this follows a RefTable and halve the margin
  margin: -${th('space.2')} 0 0;

  &:not(:last-child) {
    margin-bottom: ${th('space.3')};
  }
`

export const FooterItem = styled.li`
  font-size: 13px;
`

RefTable.Tr = Tr
RefTable.Th = Th
RefTable.Td = Td
RefTable.Footer = Footer
RefTable.FooterItem = FooterItem

export default RefTable
