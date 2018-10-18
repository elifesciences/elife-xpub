import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { th } from '@pubsweet/ui-toolkit'
import DashboardListItem from '../../ui/molecules/DashboardListItem'
import SmallParagraph from '../../ui/atoms/SmallParagraph'

const DashboardLink = styled(Link)`
  text-decoration: none;
  color: ${th('colorText')};
`
const EmptyListMessage = styled.div`
  margin-top: ${th('space.7')};
  text-align: center;
  color: ${th('colorTextSecondary')};
`

const DashboardList = ({ manuscripts }) => {
  if (!manuscripts.length) {
    return (
      <EmptyListMessage>
        You currently have no active submissions
        <SmallParagraph>
          You may want to bookmark this page to easily retrieve your in progress
          submissions.
        </SmallParagraph>
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
