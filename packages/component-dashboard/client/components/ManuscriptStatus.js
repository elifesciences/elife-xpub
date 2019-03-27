import React from 'react'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import PropTypes from 'prop-types'
import media from '@elifesciences/component-elife-ui/client/global/layout/media'

const StatusBox = styled(Box)`
  color: ${props => props.theme[props.color]};
  ${media.tabletPortraitUp`
    flex: 0 0 120px;
    margin-bottom: 0;
  `};
`

const mapColor = statusCode =>
  ({
    CONTINUE_SUBMISSION: 'colorPrimary',
    SUBMITTED: 'colorTextSecondary',
    REJECTED: 'colorError',
  }[statusCode])

const getText = statusCode =>
  ({
    CONTINUE_SUBMISSION: 'Continue Submission',
    SUBMITTED: 'Submitted',
    REJECTED: 'Rejected',
  }[statusCode])

const ManuscriptStatus = ({ statusCode }) => (
  <StatusBox color={mapColor(statusCode)} data-test-id="status" mb={3}>
    {getText(statusCode)}
  </StatusBox>
)

ManuscriptStatus.propTypes = {
  statusCode: PropTypes.string.isRequired,
}

export default ManuscriptStatus
