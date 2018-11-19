import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Flex, Box } from 'grid-styled'
import { differenceInCalendarDays, format } from 'date-fns'
import { th } from '@pubsweet/ui-toolkit'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import Icon from '../../ui/atoms/Icon'
import { DELETE_MANUSCRIPT } from '../../pages/SubmissionWizard/operations'
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
  fill: ${th('colorTextSecondary')};
`

const TrashButton = styled(Box)`
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

const ItemContent = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
`

class DashboardListItem extends React.Component {
  state = {
    isDeleted: false,
  }

  renderItemContent = () => {
    const { meta, clientStatus, created } = this.props.manuscript
    const date = new Date(created)
    return (
      <ItemContent>
        <TitleBox color={mapColor(clientStatus)} data-test-id="title" mb={3}>
          {meta.title || '(Untitled)'}
        </TitleBox>
        <ManuscriptStatus statusCode={clientStatus} />
        <DateBox>
          <time>{dashboardDateText(date)}</time>
          <AbsoluteDate>{format(date, 'ddd D MMM YYYY')}</AbsoluteDate>
        </DateBox>
      </ItemContent>
    )
  }

  onClickHandler = deleteManuscript => {
    deleteManuscript({
      variables: { id: this.props.manuscript.id },
    }).then(() => {
      this.setState({ isDeleted: true })
    })
  }
  render() {
    const { manuscript } = this.props

    return (
      !this.state.isDeleted && (
        <Root py={3}>
          {manuscript.clientStatus === 'SUBMITTED' ? (
            <React.Fragment>
              <DashboardLinkFake>{this.renderItemContent()}</DashboardLinkFake>
              <TrashButton />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <DashboardLink to={`/submit/${manuscript.id}`}>
                {this.renderItemContent()}
              </DashboardLink>
              <TrashButton>
                <Mutation mutation={DELETE_MANUSCRIPT}>
                  {deleteManuscript => {
                    console.log(manuscript)
                    return (
                      <StyledRemoveIcon
                        data-test-id="trash"
                        onClick={() => this.onClickHandler(deleteManuscript)}
                      />
                    )
                  }}
                </Mutation>
              </TrashButton>
            </React.Fragment>
          )}
        </Root>
      )
    )
  }
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
