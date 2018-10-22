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
  flex-direction: column
  height: 150px;
  border-bottom: ${th('colorFurniture')};
  border-bottom-style: solid;
  border-bottom-width: 1px;
  justify-content: space-between;

  ${media.mobileUp`
    flex-direction: row
    height: ${th('space.5')}
    height: 107px;
    align-items: center;
  `};
  :hover {
    color: ${th('colorPrimary')}
  }
`

const TitleBox = styled(Box)`
  font-weight: bold;
  text-align: left;
  font-size: 16px;
  flex-grow: 1;
`
const DateBox = styled(Flex)`
  color: ${th('colorTextSecondary')}
  justify-content: space-between;

  ${media.mobileUp`
    flex-direction: column
    text-align: right;
    flex: 0 0 120px;
  `};
`
const RelativeDate = styled(Box)`
  margin-bottom: 0;
  font-size: 16px;
`
const AbsoluteDate = styled(Box)`
  font-size: 12px;
  margin-top: 0;
`

const DashboardListItem = ({ statusCode, title, date }) => (
  <Root>
    <TitleBox data-test-id="title">{title}</TitleBox>
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
