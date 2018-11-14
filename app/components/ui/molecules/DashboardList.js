import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'
import { Mutation } from 'react-apollo'

import SmallParagraph from '../../ui/atoms/SmallParagraph'
import DashboardListItem from '../../ui/molecules/DashboardListItem'

import Icon from '../../ui//atoms/Icon'
import { DELETE_MANUSCRIPT } from '../../pages/SubmissionWizard/operations'

const DashboardLink = styled(Link)`
  text-decoration: none;
  color: ${th('colorText')};

  :hover {
    color: ${th('colorPrimary')};
  }
`
const EmptyListMessage = styled(Box)`
  text-align: center;
  color: ${th('colorTextSecondary')};
`
const EmptyListSmallParagraph = styled(SmallParagraph)`
  font-family: ${th('fontInterface')};
`

const TrashIcon = props => (
  <Icon
    iconName="Trash"
    overrideName="@pubsweet-pending.PeoplePicker.PersonPod.Remove"
    {...props}
  />
)

const StyledRemoveIcon = styled(TrashIcon)`
  margin-left: 24px;
  fill: ${th('colorTextSecondary')};
`

const renderListItem = manuscript => {
  const dashboardListItem = (
    <DashboardListItem key={manuscript.id} manuscript={manuscript} />
  )

  if (manuscript.clientStatus === 'SUBMITTED') {
    return dashboardListItem
  }
  return (
    <React.Fragment>
      <DashboardLink key={manuscript.id} to={`/submit/${manuscript.id}`}>
        {dashboardListItem}
      </DashboardLink>
      <Mutation mutation={DELETE_MANUSCRIPT}>
        {deleteManuscript => {
          console.log(manuscript)
          return (
            <StyledRemoveIcon
              onClick={() =>
                deleteManuscript({
                  variables: { id: manuscript.id },
                })
                  .then(result => {
                    this.manuscript = null
                    console.log('manuscript deleted')
                  })
                  .catch(error => console.log(error))
              }
            />
          )
        }}
      </Mutation>
    </React.Fragment>
  )
}

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

  return manuscripts.map(manuscript => renderListItem(manuscript))
}

export default DashboardList
