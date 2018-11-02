import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from 'grid-styled'
import { differenceInCalendarDays, format } from 'date-fns'
import { th } from '@pubsweet/ui-toolkit'
import PropTypes from 'prop-types'
import ManuscriptStatus from '../atoms/ManuscriptStatus'
import media from '../../global/layout/media'

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
  flex-direction: column;
  border-bottom: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  justify-content: space-between;

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
  flex-grow: 1;
  ${media.tabletPortraitUp`
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
  `};
`

const AbsoluteDate = styled.time`
  ${media.mobileUp`
    font-size: ${th('fontSizeHeading6')};
  `};
`

const DashboardListItem = ({ manuscript }) => {
  const date = new Date(manuscript.created)
  return (
    <Root py={3}>
      <TitleBox
        color={mapColor(manuscript.clientStatus)}
        data-test-id="title"
        mb={3}
      >
        {manuscript.meta.title || '(Untitled)'}
      </TitleBox>
      <ManuscriptStatus statusCode={manuscript.clientStatus} />
      <DateBox>
        <time>{dashboardDateText(date)}</time>
        <AbsoluteDate>{format(date, 'ddd D MMM YYYY')}</AbsoluteDate>
      </DateBox>
    </Root>
  )
}

DashboardListItem.propTypes = {
  manuscript: PropTypes.shape({
    meta: PropTypes.shape({
      title: PropTypes.string,
    }).isRequired,
    clientStatus: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
  }).isRequired,
}

export default DashboardListItem
