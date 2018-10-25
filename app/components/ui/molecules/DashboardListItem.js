import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from 'grid-styled'
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  format,
} from 'date-fns'
import { th } from '@pubsweet/ui-toolkit'
import PropTypes from 'prop-types'
import ManuscriptStatus from '../atoms/ManuscriptStatus'
import media from '../../global/layout/media'

const dashboardDateText = date => {
  const diffDays = differenceInCalendarDays(new Date(), date)
  const diffMonths = differenceInCalendarMonths(new Date(), date)
  if (diffDays < 0) {
    return 'Invalid date'
  }
  if (diffDays === 0) {
    return 'Today'
  }
  if (diffDays === 1) {
    return 'Yesterday'
  }
  if (diffMonths > 0) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`
  }
  return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
}

const Root = styled(Flex)`
  flex-direction: column;
  border-bottom: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  justify-content: space-between;

  ${media.mobileUp`
    flex-direction: row;
    align-items: flex-start;
    padding: calc(${th('gridUnit')} * 5) 0;
  `};
  :hover {
    color: ${th('colorPrimary')};
  }
`

const TitleBox = styled(Box)`
  font-weight: bold;
  text-align: left;
  flex-grow: 1;
  ${media.mobileUp`
    margin-bottom: 0;
    margin-right: ${th('space.3')};
  `};
`
const DateBox = styled(Flex)`
  color: ${th('colorTextSecondary')}
  justify-content: space-between;

  ${media.mobileUp`
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

const DashboardListItem = ({ statusCode, title, date }) => (
  <Root py={3}>
    <TitleBox data-test-id="title" mb={3}>
      {title}
    </TitleBox>
    <ManuscriptStatus statusCode={statusCode} />
    <DateBox>
      <time>{dashboardDateText(date)}</time>
      <AbsoluteDate>{format(date, 'ddd D MMM YYYY')}</AbsoluteDate>
    </DateBox>
  </Root>
)

DashboardListItem.propTypes = {
  statusCode: PropTypes.string.isRequired,
  title: PropTypes.string,
  date: PropTypes.instanceOf(Date).isRequired,
}

DashboardListItem.defaultProps = {
  title: 'Untitled manuscript',
}

export default DashboardListItem
