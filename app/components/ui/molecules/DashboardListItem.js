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
  height: ${th('space.5')}
  align-items: center;
  padding: 0;
`

const TitleBox = styled(Box)`
  font-weight: bold;
  text-align: left;
  font-size: 16px;
`
const DateBox = styled(Box)`
  color: ${th('colorTextSecondary')}
  text-align: right;
  padding-left: 24px;
  flex: 0 0 120px;
`
const RelativeDate = styled.p`
  margin-bottom: 0;
  font-size: 16px;
`
const AbsoluteDate = styled.p`
  font-size: 12px;
  margin-top: 0;
`

const DashboardListItem = ({ statusCode, title, date }) => (
  <Root>
    <TitleBox>{title}</TitleBox>
    <ManuscriptStatus statusCode={statusCode} />
    <DateBox>
      <RelativeDate>{dashboardDateText(date)}</RelativeDate>
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
