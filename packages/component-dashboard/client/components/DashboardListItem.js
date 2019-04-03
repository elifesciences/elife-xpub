import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Flex, Box } from '@rebass/grid'
import { differenceInCalendarDays, format } from 'date-fns'
import { th } from '@pubsweet/ui-toolkit'
import { H2 } from '@pubsweet/ui'
import PropTypes from 'prop-types'
import { Icon } from '@elifesciences/component-elife-ui/client/atoms'
import {
  ModalDialog,
  ModalHistoryState,
} from '@elifesciences/component-elife-ui/client/molecules'
import media from '@elifesciences/component-elife-ui/client/global/layout/media'

import ManuscriptStatus from './ManuscriptStatus'

export const dashboardDateText = date => {
  const diffDays = differenceInCalendarDays(new Date(), date)
  if (diffDays < 0 || Number.isNaN(diffDays)) {
    return 'Invalid date'
  }

  if (diffDays === 0) {
    return 'Today'
  }

  if (diffDays === 1) {
    return 'Yesterday'
  }

  if (diffDays < 14) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
  }

  if (diffDays < 30) {
    const diffWeeks = Math.round(diffDays / 7)
    return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`
  }

  if (diffDays < 730) {
    const diffMonths = Math.round(diffDays / 30)
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`
  }
  const diffYears = Math.round(diffDays / 365)
  return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`
}

const mapColor = statusCode =>
  ({
    CONTINUE_SUBMISSION: 'colorText',
    SUBMITTED: 'colorTextSecondary',
    REJECTED: 'colorError',
  }[statusCode])

const Root = styled(Flex)`
  border-bottom: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};

  ${media.tabletPortraitUp`
    flex-direction: row;
    align-items: flex-start;
    padding: calc(${th('gridUnit')} * 5) 0;
  `};
`

const TitleBox = styled(Box)`
  color: ${props => props.theme[props.color]};
  font-family: ${th('fontHeading')};
  font-weight: 400;
  text-align: left;
  ${media.tabletPortraitUp`
    flex-grow: 1;
    margin-bottom: 0;
    margin-right: ${th('space.3')};
  `};
`
const DateBox = styled(Flex)`
  color: ${th('colorTextSecondary')}
  justify-content: space-between;
  ${media.tabletPortraitUp`
    flex-direction: column;
    text-align: right;
    flex: 0 0 120px;
    justify-content: flex-start;
  `};
`
const AbsoluteDate = styled.time`
  ${media.tabletPortraitUp`
    font-size: ${th('fontSizeHeading6')};
  `};
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
  display: none;
  fill: ${th('colorTextSecondary')};
  ${media.tabletPortraitUp`
    display:inline-block;
  `};
`

const ButtonContainer = styled(Box)`
  width: 5%;
`

const DashboardLink = styled(Link)`
  color: ${th('colorText')};
  text-decoration: none;
  width: 95%
  :hover {
    color: ${th('colorPrimary')};
  }
`
const DashboardLinkFake = styled.div`
  width: 95%;
`

const ItemContent = styled(Box)`
  ${media.tabletPortraitUp`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`};
`
export const DashboardListItemContent = ({ manuscript, title }) => {
  const { clientStatus, updated } = manuscript
  const date = new Date(updated)
  return (
    <ItemContent>
      <TitleBox
        color={mapColor(clientStatus)}
        data-hj-suppress=""
        data-test-id="title"
        mb={3}
      >
        {title}
      </TitleBox>
      <ManuscriptStatus statusCode={clientStatus} />
      <DateBox>
        <time>{dashboardDateText(date)}</time>
        <AbsoluteDate>{format(date, 'ddd D MMM YYYY')}</AbsoluteDate>
      </DateBox>
    </ItemContent>
  )
}

const DashboardListItem = ({ manuscript, onDelete }) => {
  const title = manuscript.meta.title || '(Untitled)'

  return (
    <Root py={3}>
      {manuscript.clientStatus === 'SUBMITTED' ? (
        <Fragment>
          <DashboardLinkFake>
            <DashboardListItemContent manuscript={manuscript} title={title} />
          </DashboardLinkFake>
          <ButtonContainer />
        </Fragment>
      ) : (
        <ModalHistoryState name={manuscript.id}>
          {({ showModal, hideModal, isModalVisible }) => (
            <Fragment>
              <DashboardLink
                data-test-id="continue-submission"
                to={`${manuscript.lastStepVisited}`}
              >
                <DashboardListItemContent
                  manuscript={manuscript}
                  title={title}
                />
              </DashboardLink>
              <ButtonContainer>
                <StyledRemoveIcon
                  data-test-id="trash"
                  onClick={() => showModal()}
                />
              </ButtonContainer>
              <ModalDialog
                acceptText="Delete"
                attention
                onAccept={() => {
                  hideModal()
                  onDelete()
                }}
                onCancel={hideModal}
                open={isModalVisible()}
              >
                <H2>Confirm delete submission?</H2>
                Your submission &quot;
                {title}
                &quot; will be deleted permanently
              </ModalDialog>
            </Fragment>
          )}
        </ModalHistoryState>
      )}
    </Root>
  )
}

DashboardListItem.propTypes = {
  manuscript: PropTypes.shape({
    meta: PropTypes.shape({
      title: PropTypes.string,
    }).isRequired,
    clientStatus: PropTypes.string.isRequired,
    updated: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default DashboardListItem
