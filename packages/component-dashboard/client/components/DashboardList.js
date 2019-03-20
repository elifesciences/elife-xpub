import React from 'react'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'

import DashboardListItem from './DashboardListItem'
import Paragraph from 'ui/atoms/Paragraph'

const EmptyListMessage = styled(Box)`
  text-align: center;
  color: ${th('colorTextSecondary')};
`
const EmptyListSmallParagraph = styled(Paragraph.Small)`
  font-family: ${th('fontInterface')};
  font-size: 12px;
  font-weight: 400;
  font-family: 'Noto Sans';
`
const EmptyListParagraph = styled(Box)`
  margin-bottom: 24px;
`

const DashboardList = ({ manuscripts }) =>
  manuscripts.length > 0 ? (
    manuscripts.map((manuscript, index) => (
      <DashboardListItem
        index={index}
        key={manuscript.id}
        manuscript={manuscript}
      />
    ))
  ) : (
    <EmptyListMessage mt={7}>
      <EmptyListParagraph>
        You currently have no active submissions
      </EmptyListParagraph>
      <EmptyListSmallParagraph>
        You may want to bookmark this page to easily retrieve your in progress
        submissions.
      </EmptyListSmallParagraph>
    </EmptyListMessage>
  )

export default DashboardList
