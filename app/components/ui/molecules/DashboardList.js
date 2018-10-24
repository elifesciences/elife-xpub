import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'
import SmallParagraph from '../../ui/atoms/SmallParagraph'
import DashboardListItem from '../../ui/molecules/DashboardListItem'

const DashboardLink = styled(Link)`
  text-decoration: none;
  color: ${th('colorText')};
`
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

  return (
    <React.Fragment>
      {manuscripts.map(manuscript => (
        <DashboardLink key={manuscript.id} to={`/submit/${manuscript.id}`}>
          <DashboardListItem
            date={new Date(manuscript.created)}
            statusCode={manuscript.clientStatus}
            title={manuscript.meta.title || '(Untitled)'}
          />
        </DashboardLink>
      ))}
    </React.Fragment>
  )
}

export default DashboardList
