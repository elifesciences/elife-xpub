import React from 'react'
import styled, { withTheme } from 'styled-components'
import { Flex, Box } from 'grid-styled'
import { differenceInCalendarDays } from 'date-fns'
import { th } from '@pubsweet/ui-toolkit'

const dashboardStatusColor = (status, theme) =>
  ({
    1: theme.colorFurniture,
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

const StatusText = styled(Box)`
  color: ${props => dashboardStatusColor(props.status, props.theme)};
`

const TitleText = styled(Box)`
  font-weight: bold;
`

const DateText = styled(Box)`
  color: ${props => props.theme.colorFurniture};
`

const DashboardListItem = props => (
    <Root {...props}>
      <StatusText {...props} width={1 / 6}>
        {dashboardStatusText(props.status)}
      </StatusText>
      <TitleText width={4 / 6}>{props.title}</TitleText>
      <DateText width={1 / 6}>{dashboardDateText(props.date)}</DateText>
    </Root>
  )

export default withTheme(DashboardListItem)
