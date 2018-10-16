import React from 'react'
import styled, { withTheme } from 'styled-components'
import { Flex, Box } from 'grid-styled'
import { differenceInCalendarDays, format } from 'date-fns'
import { th } from '@pubsweet/ui-toolkit'
import PropTypes from 'prop-types'

const dashboardStatusColor = (status, theme) =>
  ({
    1: theme.colorTextSecondary,
    2: theme.colorError,
    3: theme.colorSuccess,
  }[status])

const dashboardStatusText = status =>
  ({
    1: 'Waiting for decision',
    2: 'Rejected',
    3: 'Approved',
  }[status])

const dashboardDateText = date => {
  const diffDays = differenceInCalendarDays(new Date(), date)
  if (diffDays < 0) {
    return 'Invalid date'
  }
  if (diffDays === 0) {
    return 'Today'
  }
  if (diffDays === 1) {
    return 'Yesterday'
  }
  return `${diffDays} days ago`
}

const Root = styled(Flex)`
  height: ${th('space.5')}
  align-items: center;
`
const StatusBox = styled(Box)`
  color: ${props => props.color};
  font-size: small;
`
const TitleBox = styled(Box)`
  font-weight: bold;
  font-size: small;
`
const DateBox = styled(Box)`
  color: ${th('colorTextSecondary')}
  text-align: right;
`
const RelativeDate = styled.p`
  margin-bottom: 0;
  font-size: small;
`
const AbsoluteDate = styled.p`
  font-size: x-small;
  margin-top: 0;
`
const DashboardListItem = ({ status, title, date, theme }) => {
  const statusText = dashboardStatusText(status)
  const statusColor = statusText
    ? dashboardStatusColor(status, theme)
    : theme.colorError
  return (
    <Root theme={theme}>
      <StatusBox color={statusColor} status={status} width={1 / 6}>
        {statusText || 'Invalid status'}
      </StatusBox>
      <TitleBox width={4 / 6}>{title}</TitleBox>
      <DateBox theme={theme} width={1 / 6}>
        <RelativeDate>{dashboardDateText(date)}</RelativeDate>
        <AbsoluteDate>{format(date, 'ddd D MMM YYYY')}</AbsoluteDate>
      </DateBox>
    </Root>
  )
}

DashboardListItem.propTypes = {
  status: PropTypes.number.isRequired,
  title: PropTypes.string,
  date: PropTypes.instanceOf(Date).isRequired,
}

DashboardListItem.defaultProps = {
  title: 'Untitled manuscript',
}

export default withTheme(DashboardListItem)
