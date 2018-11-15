import React from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'

import SmallParagraph from '../../ui/atoms/SmallParagraph'
import DashboardListItem from '../../ui/molecules/DashboardListItem'

const EmptyListMessage = styled(Box)`
  text-align: center;
  color: ${th('colorTextSecondary')};
`
const EmptyListSmallParagraph = styled(SmallParagraph)`
  font-family: ${th('fontInterface')};
`

const DashboardList = ({ manuscripts }) => {
  if (!manuscripts.length) {
    return (
      <EmptyListMessage mt={7}>
        You currently have no active submissions
        <EmptyListSmallParagraph>
          You may want to bookmark this page to easily retrieve your in progress
          submissions.
        </EmptyListSmallParagraph>
      </EmptyListMessage>
    )
  }

  return manuscripts.map(manuscript => (
    <DashboardListItem key={manuscript.id} manuscript={manuscript} />
  ))
}

export default DashboardList
